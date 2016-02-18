I have been working with Java for about 12 years, starting with Java 2. I have been using other languages, Python, JavaScript, C, Swift,...

There are a few things that are frustrating when writing Java that are not present in other languages.

Here is my

# Top 5

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

## Operators are special too

Operators in Java work by combining one (for unary operators) or two (for binary operators) operands of compatible types into a result of the same type as one of the operand. Only primitives (and String for `+`) are usuable with operators, or their Object equivalent, through auto-unboxing.

This means you can't use an operator with generic objects. Your operands have to be of the proper type, and they have to be so at compile time.

## Functions as first-class objects

To access a function and learn things about it, like its return type and its arguments, you need to use [reflexion](https://docs.oracle.com/javase/tutorial/reflect/), which is tedious.

With Java 8, there are function references, lambdas, and functional interfaces. It is much better, but still not perfect.

// TODO more stuff

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

## Python

- no such thing
- operators are shorthand for functions
- Functions are a type
- no such things
- list is morea combination of iterable and subscriptable

## JavaScript

It's weird. But function is a type like others

> I think I can safely say that nobody understands JavaScript prototypes
>
> --<cite>Richard Feynman</cite>

- All types can be used with operators. big wat, though.
