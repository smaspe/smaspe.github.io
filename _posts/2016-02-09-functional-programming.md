---
layout: post
title:  "Quick note on Functional Programming"
date:   2016-02-09
tags:
- java
- functional programming
---
# Introduction

Functional Programming is nice.

It helps you avoid all those loop, removes lots of conditions, and gets the code clearer as it enables very good separation of concern.

This article presents quickly what functional programming is, and how it is useful, in order to introduce the [functional programming library](https://github.com/smaspe/FunctionalIterables) that I wrote for Java 7, and that I'll present next time.

There are 2 important things you want to have for functional programming

- First-class functions
- Higher-order functions

# First-class functions

[First-class functions](https://en.wikipedia.org/wiki/First-class_function) is when you can refer to a function.

A lot of languages have First-class functions. A few: JavaScript, Swift, Python, Go...

Here, a Python example:

```python
def square(x):
  return x*x

func = square
func(42)
# 1764
```

`func` is a variable that references the function `square`

You can then pass it to another function, use it in cases like this trivial and pretty much useless example:

```python
def apply(f, p):
  return f(p)

apply(square, 42)
# 1764
```

But since `apply` takes a functions as a parameter, it is a **higher-order function**, which is a perfect transition to the next section

# Higher-order functions

In most cases, a [higher-order function](https://en.wikipedia.org/wiki/Higher-order_function) is a function that takes a function as one of its parameters, and apply it in various ways to the other parameter(s).

The best known example is `map`:

```python
map(square, [1,2,3])
# 1, 4, 9
```

It replaces the more verbose

```python
res = []
for i in [1, 2, 3]:
  res.append(square(i))
```

There are plenty other such functions.

# In Java

## First-class functions

Until Java 7, the way to reference a function is to create an interface that has one function, then create an anonymous implementation of that interface, then call the function on that object. Think about all those `OnClickListener`, for example.

In Java 8, 3 new things appeared:

- Functional Interfaces. An interface with a single method. The function and the interface are synecdoches
- Lambdas. The`() -> {}` notation basically allows you to implement a functional interface without the verbosity
- Function reference. The `::` notation allows you to refer directly to a function instead of implementing a functional interface.

Both lambdas and function references can be assigned to Functional Interfaces, provided that the signatures are compatible.

This is as close as it gets to First-class functions, as far as Java is concerned.

## Higher-order functions

Java 8 has streams, which has a lot of higher-order functions. [RxJava](https://github.com/ReactiveX/RxJava) has a lot things too. And of course, my own [Functional Iterables](https://github.com/smaspe/FunctionalIterables) which leverages the `Iterable` interface to implement higher-order functions in Java 7, but that's for another post.

## Example

Here is a quick example of what first-class functions look like in Java

### Before

```java
view.setOnClickListener(new View.OnClickListener() {

    @Override
    public void onClick(View target) {
      anotherFunction(target);
    }
});
```

For every single listener.

### After

The lambda:

```java
view.setOnClickListener((target) -> anotherFunction(target));
```

or the function reference:

```java
view.setOnClickListener(this::anotherFunction);
```

Much better.
