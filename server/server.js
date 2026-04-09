import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROGRAM_DIR = path.resolve(__dirname, '..', 'Program');
const BINARY_PATH = path.join(PROGRAM_DIR, 'blocksworld');

const TMP_CWD   = '/tmp';
const TMP_PROBS = '/tmp/probs';
mkdirSync(TMP_PROBS, { recursive: true });

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "https://blocksworld-solver.vercel.app"] }));
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ status: "Blocksworld API running" });
});

app.post("/api/solve", async (req, res) => {
    const { initial, goal } = req.body;

    if (!Array.isArray(initial) || !Array.isArray(goal)) {
        return res.status(400).json({ error: "initial and goal must be string arrays" });
    }
    if (initial.length !== goal.length) {
        return res.status(400).json({ error: "initial and goal must have the same number of stacks" });
    }

    const numStacks = initial.length;
    const numBlocks = initial.join("").replace(/\s/g, "").length;

    const initSorted = initial.join("").split("").filter(c => c.trim()).sort().join("");
    const goalSorted = goal.join("").split("").filter(c => c.trim()).sort().join("");
    if (initSorted !== goalSorted) {
        return res.status(400).json({ error: "initial and goal must contain the same blocks" });
    }

    const SEP = ">>>>>>>>>>";
    const bwpContent = [
        `${numStacks} ${numBlocks} 500`,
        SEP,
        ...initial,
        SEP,
        ...goal,
        SEP,
        "",
    ].join("\n");

    const tmpFilename = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}.bwp`;
    const tmpPath = path.join(TMP_PROBS, tmpFilename);

    try {
        writeFileSync(tmpPath, bwpContent);
    } catch (err) {
        return res.status(500).json({ error: "Could not write problem file: " + err.message });
    }

    const cmd = `${BINARY_PATH} ${tmpFilename} -H H2`;
    let stdout = "";
    try {
        const result = await execAsync(cmd, { cwd: TMP_CWD, timeout: 30000 });
        stdout = result.stdout;
    } catch (err) {
        try { unlinkSync(tmpPath); } catch (_) {}
        return res.status(500).json({ error: "Solver error: " + (err.stderr || err.message) });
    }
    try { unlinkSync(tmpPath); } catch (_) {}

    const outLines = stdout.split("\n");
    const steps = [];
    let i = 0;
    const MOVE_RE = /^move\s*=\s*(\d+),\s*pathcost\s*=\s*(\d+),\s*heuristic=(\d+),\s*f\(n\)=g\(n\)\+h\(n\)=(\d+)/;

    while (i < outLines.length) {
        const line = outLines[i];
        const m = line.match(MOVE_RE);
        if (m) {
            i++;
            const stacks = [];
            while (i < outLines.length && !outLines[i].startsWith(">>>>>>>>>>")) {
                stacks.push(outLines[i]);
                i++;
            }
            i++;
            steps.push({
                move: +m[1], pathcost: +m[2], heuristic: +m[3], fn: +m[4], stacks,
            });
            continue;
        }
        i++;
    }

    if (steps.length === 0) {
        return res.status(500).json({ error: "No solution found. Output: " + stdout.slice(0, 600) });
    }
    res.json({ steps });
});

app.listen(5000, () => console.log("Server running"));

export default app;