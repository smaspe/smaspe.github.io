# Introduction

Functional Programming is nice.

It allows you to avoid all those loop, remove lots of conditions, and gets the code clearer as it as very good separation of concern, as long as you try to use pure functions.

One of the concept required for efficient functional programming is having first-class functions.

Here is a python example:

```python
def square(x):
  return x*x

map(square, [1,2,3])
# 1, 4, 9
```

It replaces the more verbose

```python
res = []
for i in [1, 2, 3]:
  res.append(square(1))
```

# In Java

Until Java 7, the way to reference a function is to create an interface that has one function, then create an anonymous implementation of that interface. Think about all those `OnClickListener`, for example.

In Java 8, 3 new things appeared:
- Functional Interfaces. An interface with a single method. The function and the interface are synecdoches
- Lambdas. The`() -> {}` notation basically allows you to implement a functional interface without the verbosity
- Function reference. The `::` notation allows you to refer directly to a function instead of implementing a functional interface

I am not sure if this counts as First-class functions, but it looks very close.

A lot of other languages have First-class functions. A few: Javascript, C, Python, Go...

## Example

### Before

```java
view.setOnClickListener(new View.OnClickListener() {

    @Override
    public void onClick(View target) {
      anotherFunction(target);
    }
});
```

### After

```java
view.setOnClickListener((target) -> anotherFunction(target));
```

or

```java
view.setOnClickListener(this::anotherFunction);
```

Much better

# Other things required for functional programing
map, reduce, filter, stuff on lists
