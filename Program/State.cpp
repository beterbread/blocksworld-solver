#include "State.h"

State::State() : stacks() {}
State::State(const std::vector<std::vector<char>>& s) : stacks(s) {}

// Simple toString() function to hash states efficiently
// Distinct states guaranteed to have different hashes
std::string State::toString() const {
    std::string res;
    for (const auto& stack : stacks) {
        for (char c : stack) {
            res += c;
        }
        res += "|";
    }
    return res;
}

// Genererate all legal moves
std::vector<State> State::successors() const {
    std::vector<State> res;
    for (int i = 0; i < stacks.size(); i++) {
        if (stacks[i].empty()) continue;
        for (int j = 0; j < stacks.size(); j++) {
            if (i == j) continue;
            std::vector<std::vector<char>> newStacks = stacks;
            char top = newStacks[i].back();
            newStacks[i].pop_back();
            newStacks[j].push_back(top);
            res.emplace_back(newStacks);
        }
    }
    return res;
}

int State::heuristic(const State& other, std::string H) const {
    // Simple non-trivial heuristic function
    // "Number of blocks out of place"
    if (H == "H1") { 
        int res = 0;
        for (int i = 0; i < stacks.size(); i++) {
            for (int j = 0; j < stacks[i].size(); j++) {
                if (i >= other.stacks.size() || j >= other.stacks[i].size()) continue;
                if (stacks[i][j] != other.stacks[i][j]) {
                    res++;
                }
            }
        }
        return res;
    }

    // Estimate number of moves required to move a block to its correct place
    // I hereby name this heuristic as 'Peter the Great's Heuristic'
    if (H == "H2") {
        std::unordered_map<char, std::pair<int, int>> m; // char -> [goalStack, goalDepth]
        for (int i = 0; i < other.stacks.size(); i++) {
            for (int j = 0; j < other.stacks[i].size(); j++) {
                m[other.stacks[i][j]] = {i, j};
            }
        }
        int res = 0;
        for (int i = 0; i < stacks.size(); i++) {
            for (int j = 0; j < stacks[i].size(); j++) {
                auto [goalStack, goalDepth] = m[stacks[i][j]];
                if (i == goalStack && j == goalDepth) continue;
                if (i == goalStack) { // Block is in the correct stack
                    if (j < goalDepth) {
                        // Need to remove and add (goalDepth - j + 1) blocks
                        res += (2 * (goalDepth - j + 1));
                    }
                    else if (j > goalDepth) {
                        // Need to remove (j - goalDepth + 1) blocks and 
                        // one more move (+ 1) to add block to its correct place
                        res += (j - goalDepth + 2); 
                    }
                }
                else { // Block is in the incorrect stack
                    // How many moves until block is stop of incorrect stack
                    res += (stacks[i].size() - j - 1);

                    // How many moves to clear desired stack to place block in its correct place
                    // If goalDepth is higher, assume other blocks will naturally fill the space (no penalty)
                    if (stacks[goalStack].size() > goalDepth)
                        res += stacks[goalStack].size() - goalDepth;
                    
                    // Place block
                    res += 1;
                }
                
            }
        }
        return res;
    }


    // H == H0 or invalid input
    return 0;
}

bool State::operator==(const State& other) const {
    return stacks == other.stacks;
}
