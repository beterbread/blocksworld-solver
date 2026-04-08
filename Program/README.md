# Blocksworld

## Compilation
To compile, simply run:
make

## Usage
Run the program with:
./blocksworld filename [-H H0|H1|H2] [-MAX_ITERS int]

## Clean
To remove the exectuable, run:
make clean

### Arguments
- **filename**  
  Path to the input file containing the Blocksworld problem.  

### Optional Flags
- **-H H0|H1|H2**  
  Selects the heuristic used for the search:  
  - H0: No heuristic (BFS)
  - H1: Simple heuristic (Number of blocks out of place)
  - H2: Advanced heuristic (Peter the Great's Heuristic)
  Default: H0

- **-MAX_ITERS int**  
  Sets a maximum number of iterations before terminating. 
  Default: 100,000

## Examples
Run with no heuristic:
./blocksworld probA03.bwp -H H0

Run with heuristic H2 and limit to 200,000 iterations:
./blocksworld probA03.bwp -H H2 -MAX_ITERS 200000

## Known Limitations
The program guarantees a solution, but it does not always find the shortest solution.  
Some solutions may be suboptimal.
