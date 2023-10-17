---
layout: post
title:  "TypeScript is lying to you (part I)"
date:   2023-10-17
tags: typescript
description: When a supposedly typed language is not so typed after all
---

# Context

TypeScript is presented, [ by the authors](https://www.typescriptlang.org/]), as "a strongly typed programming language".

For anyone who has worked with other strongly typed languages, like Java, Kotlin, C#, this normally means that types are checked before runtime, and guaranteed, unless the users *explicitely* tries something dangerous like casting.

In TypeScript however, there are several ways of ending, without being warned, with completely wrong types at runtime.

This article presents one. There are more, which will be the subjects of more articles in the near future.

# The **issue** with `any`

There are a few ways to break the type system in TypeScript, but for ńow, I'm focussing on the fact that `any` can be *implicitely* casted into anything else.

No-one in their right mind would, on purpose and for anything other than a throw-away script, write something like this:

```ts
const double = (value: any) => {
    return 2 * value
}
```

It doesn't however, need to be that basic.

## Examples

A couple of example to illustrate slightly less obvious cases that can go un-noticed.

### `JSON.parse`

`JSON.parse` is a built-in function that returns `any`:

```ts
type MyType = {
    key: string;
}

const parsed: MyType = JSON.parse('{"value": "key"}')
// parsed is actually { value: string }
```

There are libraries that do things like generating JSON schema, validating an input, and inferring a type, but out of the box, `any` is what you get.

### `Array(n).fill("value")`

`Array(n)` returns an array of `n` undefined values, typed `any[]`. `fill(value)` fills the array with the given value, without changing its type.

```ts
const array: string[] = Array(5).fill(42);
// array is actually a number[]
```

## What about `unknown`?

TypeScript has another type that is used when the specific type is not known: `unknown`. It is equivalent to Java's `Object`. And it requires an explicit cast to be assigned to another type:

```ts

const value: unknown = 42;

const casted: string = value as string;
// This cast is necessary
```

# Why does it matter

This confuses people (e.g. [this question on StackOverflow](https://stackoverflow.com/questions/77117464/why-does-typescript-donst-do-typecheck-on-a-2d-array)). There are a few lint directive to restrict the usage of `any`, but it is still fairly easy to miss one.

Once `any` is somewhere, the error will only show up at runtime, making the whole point of a typed system moot.

To be honest, I don't fully understand why we need to have `any` in typescript, and why `unknown` is not sufficient.

Next time: how indexed types lie about what they return.
