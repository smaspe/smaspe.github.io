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

Note that in this case, the partially applied function is simply the curried function called with the first parameter.

We can define a helper class to handle most cases:

```java
public static <T2> Func1<T1, Func<R>> curry(Func2<T1, T2, R> func) {
    return (a) -> ((b) -> func(a, b));
}
```

Of course we would have to define that, along with the functional interfaces `Func`, `Func1` and `Func2` for all number of parameters, plus for variations where the functions are voids.
