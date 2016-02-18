---
layout: post
title:  "The Top 5 things I dislike about Java"
date:   2016-02-09
tags:
- java
- python
- js
description: 5 issues I think could be addressed in Java.
---

I have been working with Java for about 12 years, starting with Java 2. I have been using other languages, Python, JavaScript, C, Swift,...

There are a few things that are frustrating when writing Java that are not present in other languages.

# Here is my Top 5

## `void` is special

`void` is only ever used to indicate that a method does not return anything. It also means that a method defined as `public <T> T func();` must return something, and can never return a `void`.

There is even a [`Void`](https://developer.android.com/reference/java/lang/Void.html) type when you want a generic function to not really have a return value. It is just a placeholder, though, and your function still needs to return something. Usually `null`.

## Primitives

`int`, `long`, `char`, `bool`, `byte`, `float`, `double`, `short` all have equivalent objects, and are auto-boxed and -unboxed. Still, it is a bit weird, and can lead to unexpected behavior:

```java
Integer a = null;
int b = a;
```

causes a `NullPointerException` because you can't assign `null` to an `int`.

Other surprise:

```java
Integer.valueOf(500) != Integer.valueOf(500);
// But
Integer.valueOf(5) == Integer.valueOf(5);
```

Because of how small integers are cached and the same `Integer` objects are returned. Of course this is implementation specific.

## Operators are special too!

Operators in Java work by combining one (for unary operators) or two (for binary operators) operands of compatible types into a result of the same type as one of the operand. Only primitives (and String for `+`) are usuable with operators, or their Object equivalent, through auto-unboxing.

This means you cannot use an operator with generic objects. Your operands have to be of the proper type, and they have to be so at compile time.

And also that means that you cannot refer to an operator, because it is not a function.

## Functions as first-class objects

To access a function and learn things about it, like its return type and its arguments, you need to use [reflexion](https://docs.oracle.com/javase/tutorial/reflect/), which is tedious.

With Java 8, there are function references, lambdas, and functional interfaces. It is much better, but still not perfect.

While [Functional Interfaces](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html) provide a way to reference a function, they do not provide direct access to the function itself. You still need a functional interface that matches your function's signature to create a variable that holds it.

## `List` is broken

[`List`](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) is an interface for ordered collections. You can iterate on it, or access the elements based on their position.

But a `List` does not tell you if it is mutable or not. In other words, all the `add` and `remove` operations are marked *(optional operation)*.

For example:
```java
List<String> strings = Arrays.asList("one", "two", "three");
strings.add("four");
```

Throws an `UnsupportedOperationException`. Whenever you receive a `List` as a parameter, you do not know if you are capable of mutating it. What is worse, there are several implementations of mutable lists. [`ArrayList`](https://docs.oracle.com/javase/8/docs/api/java/util/ArrayList.html) and [`LinkedList`](https://docs.oracle.com/javase/8/docs/api/java/util/LinkedList.html) being the more famous. But there is no way to indicate in your method signature that you need a **mutable** list, short of choosing one of those.

`List` is also very generic in the sense that it does not give any indication of how is performing the underlying implementation. Every operation in a `List` has a complexity that ranges from `O(1)` to usually `O(n)` depending on what type of list it is. See [Big-O notation](http://bigocheatsheet.com/) for each type of list. Not knowing which list is used prevents from knowing the complexity of an algorithm.

This is why I always tend to try to accept the most generic interface I *know* I can work with (i.e., not `List` if I need to `add` to it), but return the most specific type I can commit to. My methods never return `List`, unless I really need to. (Typically returning the result from `Arrays.asList`). In which case, the returned `List` should not be considered mutable.

# How other languages do it

As I mentionned, I have use other languages, because all languages have unique features that make them interesting, and it is by comparing languages that I get to see what is specific, what is good, and what I like less about a language.

## Python

### `void`

There is no such thing as a `void` type, nor as a return type. There is `None`, but it can be affected to any variable, and is simply a `null` pointer. It is implicitely returned by functions that have otherwise not returned anything.

### Primitives

There is no such thing. There are literals, which allow you to express certain types (numbers, lists, dicts, strings, regex...), which is convenient, but all types are objects. Try `(1).__doc__`.

### Operators

Operators are shorthand for functions. This is *really neat*. Because there are no primitives, all things are objects, and all objects have methods. And because Python ducktypes and does not need interfaces, all you need to do is implement the function matching your operator. For example the `+=` operator (in-place addition) is implemented by the `__iadd__` function.

Also, because operators are functions and are also defined in the `operator` module, you can refer to them, and use them in higher-order functions: `functools.reduce(operator.iadd, [1,2,3])`

### Functions

Are a type in python. The have properties, and even functions.

### List

`list` in python is an array-backed list. Other types of elements you may use are `subscriptable` (can be accessed by key or index) and `iterable` (can be iterated sequentially).

## JavaScript

### `void`

Return statement are not mandatory, and return types are not a thing, so nothing more to say here.

### Primitives

Some types are represented by [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) similarly to Java. Fortunately, the dynamic typing prevents us from having to worry about it.

### Operators

All types can be used with all operators. But watch your step. For fun, try things like

```javascript
[] + []
[] + {}
{} + []
{} + {}
```

### Functions

> Every function in JavaScript is a Function object.

in [Mozilla functions reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)

### `Array`

The basic list type in JavaScript is Array. To use other types, define it yourself, or use a library. There is no indication to the developer, however what type of list (or, come to that, of what type of variable at all) they are receiving in a function, but it is generally admitted that unless indicated otherwise, `Array` is used.
