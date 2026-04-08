#ifndef STATE_H
#define STATE_H

#include <vector>
#include <string>
#include <unordered_map>

class State {
public:
    std::vector<std::vector<char>> stacks;

    State();
    State(const std::vector<std::vector<char>>& s);

    std::string toString() const;
    std::vector<State> successors() const;
    int heuristic(const State& other, std::string H) const;

    bool operator==(const State& other) const;
};

#endif
