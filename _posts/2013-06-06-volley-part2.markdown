---
layout: post
title:  "A Volley introduction - Part 2"
date:   2013-06-06
tags: android demo
description: More advanced use of Volley
---
# Introduction

Following the previous post, this is a slightly more complete demo of Volley. Past the trivial make-a-JSON-request use case, this post will show what happens when you want to add headers, authentication, body... and use custom requests.

Having read the [previous post]({% post_url 2013-06-03-volley-part1 %}) is a plus, unless you already know about Volley.

All the code used here is available on github (<https://github.com/smaspe/VolleyTwitter>). This post will use the Twitter application-only API, which requires a developer key. The key goes in the `TwitterValue` class. (see <https://dev.twitter.com/docs/api/1.1>)

This demo shows how to authenticate using `OAuth2` and the bearer token, how to use a custom request to obtain a list of tweets, how to include the tweets in a `ListView`.

# Authentication

Twitter application-only authentication uses OAuth2. Details are given here <https://dev.twitter.com/docs/auth/application-only-auth>.

It is mostly a matter of making a POST request with a custom Authorization header and retrieve in the response a token that is used for the next requests in another custom Authorization header.

In order to do that, the best match in the collection of Request objects provided by Volley is `StringRequest`. It still requires to override the `getParams()` and `getHeader()` methods, as there is no setter for these values in the `StringRequest` class.

The `TokenRequest` class is as follows:

{% gist smaspe/5720280 %}

Nota: A `JsonObjectRequest` could also have been extended, but it would have also require to override `getBodyContentType()` and `getBody()`, and I fell that would quite change the meaning of the class, as a `JsonObjectRequest` is designed to have a JSON body, if any.

Getting the Bearer token from the `String` response is quite simple, simply create a `JSONObject`, get the `access_token` value, keep it somewhere.

# Loading tweets

In this example, the twitter search API is used. A GET is to be made on the search URL, with the Bearer Authorization header. The Request in this case is `TweetsRequest`, which extends `JsonObjectRequest` to add the header (in the same fashion as the `TokenRequest`).

{% gist smaspe/5720386 %}

This request object is used by the `TweetLoader` that gets the parameters for the request (the search query, the max_id from the already loaded items), receives events from the `EndlessScrollListener`, and has a `Listener<JSONObject>` to populate the `TweetAdapter` (a simple `ArrayAdapter` that uses `NetworkImageView` and `TextViews` to display the basic info of the tweet). The `TweetLoader` is rather simple, but a bit long to be pasted here, the full code is there: <https://github.com/smaspe/VolleyTwitter/blob/master/src/com/njzk2/twitterbrowser/TweetLoader.java>.

# A few more things

This demo app also uses a search dialog, as described here <http://developer.android.com/guide/topics/search/search-dialog.html>, and an `EndlessScrollListener` that allows tweets to be loaded as needed, this comes mostly from <http://benjii.me/2010/08/endless-scrolling-listview-in-android/>. The `BitmapLru` is the same as in the previous post.

# Conclusion

Volley shows a few limitations in a more complex scenario:

Adding headers is a matter of extending a `Request` class. As such, a common header used in several types of `Requests` (typically `JsonObjectRequest` and `JsonArrayRequest`) requires duplicate overriding code.

`ImageLoader` instantiate exclusively `ImageRequest`. That means it is not possible without modifying Volley to add headers to `ImageRequests`, such as Authorization headers.

Requests sub-types have apparently been designed with a specific usage in mind. In fact, `JsonArrayRequest`, for example is exclusively a GET request, without possibility to change that unless overriding several methods, including `getMethod()` method and parameters/body are passed through the constructor, without possibility to set them afterward. That means the construction of the body must either happen outside the extending class or inside the `super()` call, which is not always possible in case some formatting is required.
