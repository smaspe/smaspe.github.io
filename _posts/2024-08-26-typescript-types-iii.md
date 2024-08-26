---
layout: post
title:  "TypeScript is lying to you (part III)"
date:   2024-08-26
tags: typescript
description: What is even "this"?
categories:
- The lies of TypeScript
---

# Context

See the [previous post]({% post_url 2023-10-19-typescript-types-ii %}) for a bit of context. In a nutshell, TypeScript pretends to be typed, but falls short in many cases.

## What is `this`?

`this` is a reserved keyword in JavaScript and TypeScript that refers to a few different things. In most cases, the expected behavior is that `this` is the object that contains or owns the function you're calling.

Typically:

```ts
class Library {
  books: string[] = [];
  add(book: string) {
    this.books.push(book);
  }
  print() {
    for (const book of this.books) {
      console.log(book);
    }
  }
}
```

In the `print` function, `this` is expected to be an instance of `Library`.

# The **issue** with `this`

I write "`this` is expected to be" because that's the issue we're exploring today. Coming from many other languages, like Java, Python, even PHP, `this` looks like a familiar staple of OOP: the current instance.

The expectation is strong enough that any IDE will happily tell you that `this` is a `Library`, and that even the compiler will insist that it is a `Library`.

However, that's not always the case (!).

`this` really is either:
- the object this function is `bound` to (using `fn.bind`)
- the object this function is _called from_ (using `object.fn()`)
- (`undefined` or `window`, depending on the `strict` mode. Let's assume we're all reasonable and running in `strict` mode from now on.)

## Example

A common pattern in, e.g. Java since Java 8, is to store function references to call them later, for example as a callback.

```ts
function grabABook(callback: (book: string) => void) {
  const book = "foobar";
  callback(book);
}
// ...
const library = new Library();
// Grab a book, and add it to the library
grabABook(library.add);
```

Let's remember that `library.add` is simply `this.books.append(book)`. The result is an Error: `this is undefined` (because `this` is `undefined`!).

## But why?

As we've seen, `this` is not really just the instance on which the function is being called. It depends on binding, and on _how_  the function is called. Like the actual syntax used to call the function.

When calling `callback(book)`:
1. The function is not bound
2. There is no `object.` before the function name
3. Therefore, `this` is `undefined`

# How to fix it

The second way of finding `this`, related to the calling syntax, is, in my opinion, ridiculous ([see here if you still want to know](https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript)). Instead let's focus on binding the function so that it belongs correctly to its object.

## Explicit bind

`grabABook(library.add.bind(library));`

I find this verbose, confusing, and easy to miss. It's also possible to do this in the class constructor: manually bind all the function to `this`.

Note that if you bind a function, you can also re-bind it later. Which is even more confusing. If you think of binding a function, please think again.

## Auto bind

This is a little more interesting: use the arrow notation for a function

```ts
  add = (book: string) => {
    this.books.push(book);
  }
```

Arrow functions are always auto-bound to their object, and so the ambiguity is removed

# Why does it matter

The compiler, any smart IDE, and common sense expects a certain behaviour (but one should now know not to rely on common sense when it comes to JS or anything related to it). This sort of error is surprising and highly confusing.

At the very least, the type verification in the TypeScript compiler should not lie.

# References

- https://www.typescriptlang.org/docs/handbook/2/classes.html#this-at-runtime-in-classes
- https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript
