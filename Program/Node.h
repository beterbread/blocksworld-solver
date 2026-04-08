#ifndef NODE_H
#define NODE_H

#include "State.h"

class Node {
public:
    State state;
    Node* parent;
    int g, h, f;
    std::string stats;

    Node();
    Node(const State& state, Node* parent, int g, int h, int f, std::string stats);
};

#endif
