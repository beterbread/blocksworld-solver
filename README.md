# Blocksworld Solver

👉 [Live demo](https://blocksworld-solver.vercel.app/)

## About
 
This web app showcases my C++ program to solve the Blocksworld planning problem using the A* search algorithm. You can drag and drop blocks to configure the intital and goal states, and the solver will find a sequence of moves.
 
The web app was built with React, Tailwind CSS, and Express.
 
## What is the Blocksworld planning problem?
 
The Blocksworld problem is a classic problem in AI planning. You have a set of lettered blocks distributed across a number of stacks (columns), and a goal arrangement you want to reach. The only legal move is to take any single block and place it anywhere in any stack. The challenge is finding the shortest sequence of moves from the inital state to the goal state.

## What is the A* (A-star) search algorithm?
 
A* is an informed search algorithm, meaning it uses a heuristic to guide its search toward the goal rather than blindly exploring every possible state.
 
At every step, A* selects the most promising state to explore next based on the score:
 
$$f(n) = g(n) + h(n)$$
 
- **g(n)** - the number of moves already made to reach the current state (the path cost so far)
- **h(n)** - the heuristic estimate of how many more moves it will take to reach the goal
- **f(n)** - the total estimated cost of the solution through this state
 
A* keeps a priority queue (called the frontier) of states ordered by f(n), always expanding the state with the lowest score first. States that have already been visited are tracked in a hash set so they are never revisited.
 
If the heuristic **admissibile**, meaning that it never overestimates the true cost to the goal, A* is guaranteed to find an optimal solution. 
 
In my implementation, the frontier is a `std::priority_queue` sorted by f(n), and visited states are stored in a `std::unordered_set` using a string hash of the board configuration for O(1) lookup.
    
## My Heuristic
 
My heuristic is built on one key insight: **if a block is in the wrong position, every block above it is also wrong**, because they all need to be moved out of the way before that block can be corrected.
 
For each stack, the heuristic scans from the bottom up. As soon as it finds a block that is not in its correct position, it marks the rest of that stack as "corrupted." Every block from that point to the top of the stack is counted as needing at least one move, regardless of where it actually sits.
 
The total heuristic score is simply the number of blocks that are guaranteed to need moving.
 
### Admissibility
 
The heuristic is admissible as it never overestimates the true number of moves required. Every block it counts needs *at least* one move to be corrected, so the estimate is always a lower bound on the actual solution cost. This guarantees that A* will always find an optimal or near-optimal solution.