A few month ago, while working on an app, I realized Java was lacking higher-order functions.

I realized this because of 2 reasons:
- Around me a lot of people were using JavaScript, and discussing whether to use [Ramda] or [Lodash], both being JavaScript libraries of higer-order functions
- I had been playing with [retrolambda], which backports in particular lambdas and function references from Java 8

So, having functions close enough to being [first-class objects]({% post_url 2016-02-09-functional-programming %}), I was in need of higher-order functions to use them.

A few higher-order functions:
- `map`
- `filter`
- `all`
...

Because I like simple things, the library was going to be based on exising things.
I needed to be able to use it in code very easily.
It uses the `Iterable` interface.
Python uses a similar approach for its `functools` module for [functional programming](https://docs.python.org/dev/howto/functional.html).
The `Collection` interface extends `Iterable`, so all collections, sets, lists,... could be used there.
`Iterable` defines only one method, so it is easy and short to implement, and it can be done using a lambda.

The `FuncIter` class is a [decorator](https://en.wikipedia.org/wiki/Decorator_pattern) to `Iterable`, i.e. it adds features to an existing instance.

All functions are instance methods and static methods. You can chain them, or call them in one shot.

A quick note on `collect`. This method returns an `ArrayList`, rather than a `List`. I covered that in a [previous article]({% post_url 2016-02-18-issues_with_java %}).
By returning an `ArrayList`, I guarantee that the returned object is a mutable list, with, for example, a complexity for getting an arbitrary item of `O(1)`.
It also means that I am not allowed to change it, ever.

The whole library fits in a single file, and has no dependency.

It is thoroughly tested, with the tests having 100% coverage, and updates are published on [jCenter](https://bintray.com/bintray/jcenter).

So there you have it, a 300-line library, 100% tested, compatible with Java7, containing the main higher-order functions for your daily functional programming needs.
