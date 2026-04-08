#include "Node.h"

Node::Node() : state(), parent(nullptr), g(0), h(0), f(0) {}

Node::Node(const State& state, Node* parent, int g, int h, int f, std::string stats)
    : state(state), parent(parent), g(g), h(h), f(f), stats(stats) {}
