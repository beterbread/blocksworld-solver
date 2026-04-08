#include "State.h"
#include "Node.h"

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <stack>

// For priority_queue, sorted based on f(n)=h(n)+g(n)
struct CompareNode { 
    bool operator()(Node* a, Node* b) {
        return a->f > b->f; 
    }
};

// Global variables
State initial = State();
State goal = State();
std::priority_queue<Node*, std::vector<Node*>, CompareNode> frontier;
std::unordered_set<std::string> discovered;
std::string filename;
std::string H = "H0"; // Default BFS
int MAX_ITERS = 100000;
std::string solution_stats; 

// Parse file, Construct initial + goal state
void parse_file() {
    std::ifstream file(filename);
    int s, b, m; // Number of stacks, blocks, moves
    std::string trash, line;

    file >> s;
    file >> b;
    file >> m;

    getline(file, trash); // New line \n
    getline(file, trash); // Separator line
    
    // Initial state
    std::vector<std::vector<char>> initial_matrix(s);
    for (int i = 0; i < s; i++) {
        getline(file, line);
        for (char c : line) {
            initial_matrix[i].push_back(c);
        }
    }

    getline(file, trash); // Separator line

    // Goal state
    std::vector<std::vector<char>> goal_matrix(s);
    for (int i = 0; i < s; i++) {
        getline(file, line);
        for (char c : line) {
            goal_matrix[i].push_back(c);
        }
    }

    file.close();

    initial = State(initial_matrix);
    goal = State(goal_matrix);
}

// A* algorithm! 
Node* a_star(State initial) {
    int h0 = initial.heuristic(goal, H);
    std::string stats = "move = 0, pathcost = 0, heuristic=" + std::to_string(h0) + ", f(n)=g(n)+h(n)=0";
    Node* initial_node = new Node(initial, nullptr, 0, h0, h0, stats);
    frontier.push(initial_node);
    discovered.insert(initial_node->state.toString());

    int iter = 0;
    int max_qsize = 0;

    while (!frontier.empty() && iter < MAX_ITERS) {
        Node* current = frontier.top();
        frontier.pop();

        max_qsize = std::max(max_qsize, (int)frontier.size());

        if (current->state == goal) {
            solution_stats = "statistics: " + filename + " " + std::string("method ") + (H=="H0"?"BFS":"A*") +
                    " planlen " + std::to_string(current->g) +
                    " iter " + std::to_string(iter+1) +
                    " maxq " + std::to_string(max_qsize);
            return current;
        }

        std::vector<State> successors = current->state.successors();

        // Print tracing info every 1000 iterations
        if (iter % 1000 == 0) {
            std::cout << "iter=" << iter + 1
                      << ", depth=" << current->g
                      << ", pathcost=" << current->g
                      << ", heuristic=" << current->h
                      << ", score=" << current->f
                      << ", children=" << successors.size()
                      << ", Qsize=" << frontier.size()
                      << "\n";
        }

        for (const State& s : successors) {
            std::string hash = s.toString();
            if (discovered.find(hash) == discovered.end()) {
                int g_new = current->g + 1;
                int h_new = s.heuristic(goal, H);
                int f_new = g_new + h_new;

                std::string child_stats = "move = " + std::to_string(g_new)
                                        + ", pathcost = " + std::to_string(g_new)
                                        + ", heuristic=" + std::to_string(h_new)
                                        + ", f(n)=g(n)+h(n)=" + std::to_string(f_new);

                Node* next = new Node(s, current, g_new, h_new, f_new, child_stats);
                frontier.push(next);
                discovered.insert(hash);
            }
        }
        iter++;
    }

    if (iter == MAX_ITERS) {
        std::cout << "Reached MAX_ITERS limit\n";
    }

    return nullptr;
}


// Print solution by backtracking through parent nodes
void print_solution(Node* solution) {
    if (!solution) {
        std::cout << "No solution found\n";
        return;
    }

    std::stack<Node*> path;
    Node* current = solution;
    while (current) {
        path.push(current);
        current = current->parent;
    }

    int step = 1;
    while (!path.empty()) {
        Node* node = path.top();
        path.pop();
        std::cout << node->stats << "\n";
        for (const auto& stack : node->state.stacks) {
            for (char c : stack) std::cout << c;
            std::cout << "\n";
        }
        step++;
        std::cout << ">>>>>>>>>>\n";
    }
    std::cout << solution_stats << "\n";
}

int main(int argc, char* argv[]) {
    filename = "./probs/" + std::string(argv[1]);
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        if (arg == "-H") {
            if (i + 1 < argc) {
                H = argv[i + 1];
                i++;
            }
            else {
                std::cerr << "Error: -H flag needs a value\n";
            }
        }
        else if (arg == "-MAX_ITERS") {
            if (i + 1 < argc) {
                MAX_ITERS = std::stoi(argv[i + 1]);
                i++;
            }
            else {
                std::cerr << "Error: -MAX_ITERS flag needs a value\n";
            }
        }
    }

    parse_file();
    Node* solution = a_star(initial);
    print_solution(solution);

    return 0;
}