---
layout: post
title:  "Download a File"
date:   2013-06-10
tags: android one-liner
description: Quick one-liner to fetch a file in Java/Android
---

One-liners are pieces of code that allow to rapidly perform a rather complex function in only one line.

This one downloads a file using Apache `HttpClient`, which is present on Android.

{% gist smaspe/5747574 %}

`root` being wherever you want the file to go. In Android, it is also possible the replace the `new FileOutputStream(...)` by the recommended `Context.openFileOutput(...)`.

This piece of code is meant to be used in a Quick&Dirty development context, as there is no error checking and no fail-proofing whatsoever.
