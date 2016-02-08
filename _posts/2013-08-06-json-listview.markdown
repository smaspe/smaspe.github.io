---
layout: post
title:  "JSON to ListView"
date:   2013-08-06
categories: android, demo, FA-SO-Q
---
# Introduction

A group of question often seen on [StackOverflow](https://www.stackoverflow.com) is about inserting data fetched from a webservice into a `ListView`. Several examples exist, but I find they are often too chatty, and a number of mistakes can be found in them.

This is therefore my attempt at a clear, precise, and complete demonstration of implementing such a feature.

Code is (as with previous posts) presented as a fully functional Eclipse project that can be cloned from <https://github.com/njzk2/JSONToListView>

The intent is to be as concise as possible and avoid redundancy.

This demo is based on [Sna.pr](https://sna.pr) API to fetch some JSON data.

# Download a JSONArray

The `Downloader` class is an `AsyncTask` that expects a single url as the execute param, and takes an `ArrayAdapter<String>` in the constructor.

Using an `AsyncTask` is the recommended way of handling networking (or any long operation) that has an impact on the UI. The reasons are that it comes with the callbacks to act on the UI thread, and also that it is executed in a thread pool, meaning that using AsyncTasks guaranties the maximum number of threads used at a given moment for these tasks.

Moreover, networking on the UI thread will give you `NetworkOnMainThreadException` on any recent Android.

The actual download of the JSON content is made using `HttpClient` for concision, but any http library can be used. It is performed in the `doInBackground` method.

An important part here is to explicitly specify the encoding. JSON is by default encoded in UTF-8. (And always in Unicode anyway. See RFC <http://www.ietf.org/rfc/rfc4627.txt?number=4627>)

{% gist smaspe/6165095 %}

# Populating the `ArrayAdapter`

Here, there is no need for intermediary array. The `ArrayAdapter` has a `add(T item)` method that allows to directly add items. The `ListView` will be automatically notified.

{% gist smaspe/6165209 %}

In this example, the `ArrayAdapter` is a stock object. It is however, possible to extend it. In this case, too, keeping a reference to an array is not necessary. The default methods `getItem(int position)`, `getPosition(T item)`, `getCount()` ... allow access to the underlying data, with the guaranty to properly notify the ListView of any change.

# Launching the request

To actually launch the request, very little is still needed. A `Downloader` instance only need the url and an `ArrayAdapter<String>`.

{% gist smaspe/6165228 %}

Very simple.

# Conclusion

This is not perfect because the `AsyncTask` is not stopped when the activity is exited.

This is also not perfect because `HttpClient` is not recommended for android >= Gingerbread. I like it for its clarity and simplicity, but I should really start using `HttpUrlConnection`.

Some (all) resources are not closed. I know we are supposed to, but I never had any problem with un-closed resources.

In conclusion:

- Don't hold instance of arrays everywhere. The `ArrayAdapter` alone is sufficient to hold the data in most cases
- Don't do your networking on the main thread. Use an `AsyncTask`, or a `Service`
- JSON is encoded in UTF-8 by default. Any other value could work for a while and then break when you encounter a more exotic character
- Use a `ListActivity` when using a `ListView`. It removes some boilerplate
- Use existing Android method, such as `EntityUtils`, to lighten and shorten your code
