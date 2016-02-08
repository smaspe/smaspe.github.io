---
layout: post
title:  "Cat versus Dogs!"
date:   2013-05-31
tags: algorithm
---
A few months ago I stumbled upon http://www.spotify.com/us/jobs/tech/

Apparently, Spotify likes puzzles.

The 1 first is very trivial.

The second one is quite immediate (spoiler: you just need to know that `1/zi` is equivalent to `i`).

The third puzzle is a little more tricky.

# Problem description

We have a set of cats, a set of dogs, and a set of voters. Each voter chooses one cat and one dog, and chooses which is to be kept, and which is to be discarded.

We try to maximize the number of votes that can be satisfied at once.

## Spoiler alert

I expose the solution in this post, and you may want to try it yourself before reading a solution.

# Representation

The instinctive representation of this problem is a graph in which vertices are votes, and edges are compatibility. This graph is split in 2 obvious cliques (complete sub-graph), the clique of dog lovers and the clique of cat lovers. (Any dog-lover's vote is compatible with any other dog-lover's vote, same goes for cats).

The complementary graph is more interesting. It is the graph of incompatibility. `(c, d) is in G if c => !d`. It has less edges, which is always good.

The 2 cliques in the first graph become independent sets in this complement. A graph of 2 independent sets is a bipartite graph. The graph of incompatibility is bipartite. This is the key to the solution.
This graph can also be represented as a 2-SAT function. 2 votes being incompatible can be expressed as ``(!c or !d)`` being a constraint the the 2-SAT. A clause represents an edge in the incompatibility graph.

# Research for solution

The graph of compatibility gives a first naive approach of the resolution. A clique (complete sub-graph) is a solution. No 2 votes that are not compatible can be found in the solution.

The largest clique is the group of all the voters that can be selected at once.

However, the largest clique problem is NP.

The complementary problem to the clique problem is the largest independent set. Naturally, being the complement to the clique problem, it is NP as well.

The 2-SAT function offers another approach. One sub problem is the research of all solutions, which can be reduced by pruning to the research of the largest solution set. This problem is NP as well, but in the case of a bipartite 2-SAT, (which it is) Feder (1994) demonstrate that network flow leads to a solution that is quite similar in the idea to Ford-Fulkerson and König. (See below).

# Actual solution

Bipartite graph have interesting properties. One of them is expressed by the König theorem, that states that the cardinal of the minimum vertex cover is equal to the cardinal of the maximum matching in a bipartite graph.

A simple proof is:

Consider any matching in which each edge goes from a vertex from the minimum cover to a free vertex.
The largest of such matchings (M) has as many edges as the cover has vertices.
By definition of the cover, any edge not in M also start at a vertex from the cover, making it adjacent to M.

```
(u, v) not in M => (u, v) is adjacent to M
```

*Adding any edge to M makes it not a matching anymore.*

Knowing that a set is independent if and only if its complement is a vertex cover, the largest set is naturally the complement to the minimum vertex cover.

Remains that finding a maximum matching in a bipartite graph can be solved in polynomial time. There are at least 2 method for this. The Ford-Fulkerson uses maximum flow. It is quite extensively described in the Introduction to Algorithms. The Hopcroft-Karp uses augmenting paths (which are also used in maximum flow).

# Implementation

I must admit I used an available implementation to the Hopcroft-Karp. It can be found [here]( http://code.activestate.com/recipes/123641-hopcroft-karp-bipartite-matching/).

The author is David Eppstein, he is a computer science teacher at the University of California.

This is easily integrated with the input of the problem, graph represents for example the incompatibility from cat lovers to dog lovers. M is the first item in the result set. `|M|` is `len(bipartiteMatching[0])`, the solution is therefore

```
S = v - len(bipartiteMatching[0])
```
