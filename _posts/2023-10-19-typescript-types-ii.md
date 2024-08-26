---
layout: post
title:  "TypeScript is lying to you (part II)"
date:   2023-10-19
tags: typescript
description: More adventures in finding inconsistencies in types
---

# Context

See the [previous post]({% post_url 2023-10-17-typescript-types %}) for a bit of context. In a nutshell, TypeScript pretends to be typed, but falls short in many cases.

# The **issue** with indexable types

TypeScript supports a few indexable types. By indexable, I mean that we can use `[index]` notation to get a value.

Those types are, well, typed, and the type of the value returned by the index notation is known.

But it is not correct, in many cases.

## Examples

### `Record<string, string>`

A very common thing to see:

```ts
const material: Record<string, string> = {
    "Fifer": "Straw",
    "Fiddler": "Wood",
    "Practical": "Bricks",
}

const other = material["Wolf"];
```

Here, `other` is of type `string`. But its value is actually `undefined`. Its correct type is `string | undefined`.

In other languages, requesting an invalid index throws an error.

Note that it's not the case when using finite types for the keys:

```ts
type Pigs = "Fifer" | "Fiddler" | "Practical";

// This is invalid because the record is missing 2 keys
const material: Record<Pigs, string> = {
    "Fifer": "Straw",
}

// This is invalid because "Wolf" is not part of the record key type
const other = material["Wolf"];
```

### `[]`

Arrays suffer the same problem. Consider:

```ts
const materials = ["Straw", "Wood", "Bricks"];

const mat = materials[42];
```

Here as well, `mat` is of type `string`, but really is `undefined`. An error indicating that the index is out of bound would make this error easier to debug.

Note that when using constants, TypeScript is more strict about the inferred type, and can detect index issues:


```ts
const materials = ["Straw", "Wood", "Bricks"] as const;

// This is invalid, because `materials` is now a tuple of size 3
const mat = materials[42];
```

## What about `.at()`?

Arrays have `.at()` function, which types the output as `string | undefined`. (The function also has other uses, such as negative indices). That's a little more honest, but arguably a little less practical.

Records don't have such a thing.

# How to fix it

TypeScript has lots of options in `tsconfig`. The one relevant for this case is [`--noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess).

Enabling this option will make indexed access return optional values. I wish TypeScript would just have this enabled by default.

# Why does it matter

For `Record`, it matters because depending on the type of the key, it behaves differently.

For limited types, like unions of literals, it strictly enforces that the `Record` can only have those keys, but must have all of them.

For unlimited types, like `string` or `number`, any number of keys is ok, and all values are assumed to have the right type.

It's confusing.

Next time: `this` is not always what you think `this` is.
<!--stackedit_data:
eyJoaXN0b3J5IjpbOTU0OTcyMTEzXX0=
-->