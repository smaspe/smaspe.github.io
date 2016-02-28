---
layout: post
title:  "Publish an open-source library"
date:   2016-02-25
tags:
- open-source
description: Because everyone should be writing open-source libraries if they have the opportunity
---
So you want to publish a library?

There are a few questions you should be asking yourself.

# What
What library. What does it do, why is it different/more relevant than existing libraries, how is it useful to other people. Jesse Wilson said during one of his presentations that you should not write yet another JSON parsing library. But then he presented [moshi](https://github.com/square/moshi).

A new library can be a different approach to a known problem that suits you better. Or a totally new thing. Or an SDK to use another of your products. Or a bunch of things you often need in a project, and that you think fit together as a consistent entity.

# Who
Everyone, really. Companies, individuals, hobbyist, students...

# Why
Why are you writing a library? Here a few good reasons, that apply differently depending on who you are:

- Better modularity and separation of concern in your code
- Possibility of peer review
- Open source is cool. It can be a part of your port-folio, or carry a positive image for a company.
- Give back something to the community. You probably have dozens of open-source libraries in your own projects.
- Make that part of your code a proper product so it gets the documentation and QA attention it deserves
- Make it easier to reuse it in other projects

# When
How do you know when it is time to write a library?

- When there is a component that naturally emerges from your code, and it starts to look like it has a personality
- When you architecture your project, and realize that one of the module is really independent from the rest

# How
There are a few things to do in order to ensure your library is in good shape to put out there.

## Open sourcing
That's the obvious step. If you are not publishing the library itself, I don't know what you are doing here, and if you are not open-sourcing it, you loose most of the benefits of the publication.

The current place to be is github, but it could also be sourceforge, bitbucket, or any mean you want.

## Documenting
If you want people (including your future self who does not remember how you wrote this thing) to be able to use the library, well, obviously, you need to document it. Also, because it is now open-source, you are responsible for it.

## Testing
A code that has tests is immediately perceived as more reliable.

## Making sure you test it (coverage)
A single test that passes is not a very good guarantee. Try to aim for 100% coverage. Various tools can help you measure that, depending on your platform, and can help you identify the edge cases you may have missed.

## Publish it
To help people use it (including yourself), as most modern build systems have dependency management integrated with publication systems. (`npm` for JavaScript, `pip` for Python, `maven` for Java...)

# Example
I recently published a Java/Android library of higer-order functions for functional programming. It is a Java library, and uses Gradle as build system, so most of the information here are related to that. It is described in a separate [article]({% post_url 2016-02-27-publish-android-library %}).
