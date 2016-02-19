# Curry

[Currying](https://en.wikipedia.org/wiki/Currying) a function is the process of transforming a function that takes several argument in a function that takes one argument, and returns a function that takes one argument, and returns... until all the arguments are given.

# Using lambdas

Consider a function

```java
public void String concat(String a, String b) {
  return a + b;
}
```

You can write that function as `SomeFunctionalInterface f = (a, b) -> a + b`.

Curried, this gives: `((a) -> ((b) -> f(a,b)))`

We can define a helper class to handle most cases:

```java
public static <T2> Func1<T1, Func<R>> curry(Func2<T1, T2, R> func) {
    return (a) -> ((b) -> func(a, b));
}
```

Of course we would have to define that, along with the functional interfaces `Func`, `Func1` and `Func2` for all number of parameters, plus for variations where the functions are voids, because there is no root `FunctionalInterface`, each functional interface is simply a distinct one. Not to mention varargs.

# Partial Application

A partial application is calling a function with some of its parameters so that the result is a new function that takes the rest of the parameters to produce the final result.

```java
public R func(T1 a, T2 b, T3 c);
```

Then that would look like: `partiallyApply(func, obj1, obj2)`, which is a `(T3) -> R` function (or `Func1<T3, R>`, from previous terminology). It can be implemented like that `(c) -> func(obj1, obj2, c)`. You should notice that it looks a lot like what `curry(func)(obj1)(obj2)` would do.

Partial application is very interesting for creating pure functions and capturing variables in a given scope. Pure functions that you then use in a context of functional programming, meaning we have to assume you have some higher-order functions available.

For example, in Android, `TextUtils.concat` concatenates `CharSequences`.

If you want to prefix each string of a list with another string, you could write the long version

```java
ArrayList<String> newStrings = new ArrayList<>();
for (String string : oldStrings) {
    newStrings.add(TextUtils.concat("prefix ", string);
}
```

or the shorter

```java
ArrayList<String> newStrings = map(oldStrings, (string) -> TextUtils.concat("prefix ", string));
```

now this `(string) -> TextUtils.concat("prefix ", string)` is a partial application of `concat` with `"prefix"` as initial parameter.

This function is independent from the context. You can unit-test it, you can define it outside of this context

```java
Func<String, String> prefix = (string) -> TextUtils.concat("prefix ", string);
```

Obviously those are simple examples, not very interesting. // TODO find better examples
