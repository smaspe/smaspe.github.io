---
layout: post
title:  "An extension to Volley"
date:   2013-06-17
categories: android, demo
---
# Introduction

In [the previous Volley-related post]({% post_url  2013-06-06-volley-part2 %}), I mentioned some reservations in some more complex use cases.

Volley, in its current state, is not convenient when you need to:

- Add headers to your requests
- Add a body the some requests
- Customize ImageRequest (for authentication...)
- Define a common behavior to all your requests

The code presented here is a shot at trying to solve these issues. It can be found here: <https://github.com/smaspe/ExtVolley>

No modification is made to Volley, so this comes as an compatible addition.

# ImageLoader

The `ImageLoader` in Volley uses `ImageRequests`. These `Requests` cannot be modified, as `ImageRequest` is explicitly instanciated. The solution here is to make a new `ImageLoader` that takes a factory as a parameter. I am not quite satisfied with the solution I have come up with so far, as there is a lot of duplicate code from `ImageLoader` (which obviously was not designed to be extended).

The relevant parts:
{% gist smaspe/5795808 %}

The factory is quite simple, it just needs to provide a `ImageRequest`.

{% gist smaspe/5795862 %}

The default `ImageRequestFactory` is simply

{% gist smaspe/5795887 %}

# Requests

`DelegatingRequest` is a class that extends `Request`, adds getters and setters for body and headers, and delegates the handling of the network response to a `NetworkResponseParser`.

This way, the `DelegatingRequest` is the only type of request required, it is therefore easier to extend for specific behaviors.

{% gist smaspe/5795917 %}

`NetworkResponseParser` is in charge of handling the actual work, making it easy to add support to new Response types.

For instance, a `String` parser looks like that

{% gist smaspe/5795942 %}

# Examples

## ImageLoader

As you can see, it is now easy to create an `ImageLoader` that can use any `ImageRequest` object.

{% gist smaspe/5796286 %}

# Request

An example of the use of `DelegatingRequest`

{% gist smaspe/5796296 %}

It is possible to add headers, content values, to change the body and the body content type.

# Conclusion

I don't find Volley particularly easy to extend, in particular the image loader part. I expect the dev team to come up with a better solution for this quite soon.

I also find the current `Request` extension system quite clumsy, lots of code can easily get duplicated as there is no separation between the request typing and the response parsing. I find (obviously) my solution rather more elegant, and more importantly more easily extendable.
