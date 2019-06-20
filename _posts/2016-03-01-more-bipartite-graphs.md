---
layout: post
title:  "More bipartite graphs"
date:   2016-03-01
tags:
- algorithm
description: CodeFights company bots like puzzles
---
Yesterday, on [CodeFights](https://codefights.com/), against a company bot, I was confronted to an interesting problem. I will try as much as possible to avoid revealing which company that was and what problem that was.

It can be formulated like this:

- Let `U` be a set of intervals
- Let `V` be a set of intervals, each intervals being associated with a length
- An element of `V` can be matched with an element of `U` if and only if the intersection of the 2 intervals is longer than or equal to the length associated with the element in `V`
- Determine if it is possible to match each element of `V` with an element of `U`

For example:

- `u = [1, 4]` is not compatible with `v = [3, 5], length = 2`
- `u = [1, 6]` is compatible with `v = [3, 5], length = 1`

From this formulation, it appears rapidly that this describes a [bipartite graph](https://en.wikipedia.org/wiki/Bipartite_graph). The condition of matching indicates if there is an edge between a vertex in `U` and `V`, and `U` and `V` are disjoint sets.

This starts to look a lot like [cat vs dogs]({% post_url 2013-05-31-cat-vs-dogs %}), a problem from Spotify I solved a few years ago.

And indeed it does. The problem asked is simply to find if a [maximum matching](https://en.wikipedia.org/wiki/Matching_(graph_theory)#Maximal_matchings): a maximum matching matches exactly `n` distinct elements from `U` to `n` distinct elements from `V` using `n` edges.

The solution is therefore to measure is the cardinal of the **maximum matching** is the same as the cardinal of the set `V`.

A link to an implementation of the Hopcroft-Karp algorithm, which computes the maximum matching of a bipartite graph can be found at the end of the Cat vs Dog problem article.

Maximal matchings are very useful to solve optimization problem where you have to find the better arrangement for a set of elements to another set.
