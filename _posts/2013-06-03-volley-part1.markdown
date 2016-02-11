---
layout: post
title:  "A Volley introduction - Part 1"
date:   2013-06-03
tags: android demo
description: Simple tasks using the Volley library
---
# Introduction

A few days ago, during the Google I/O, Ficus Kilkpatrick presented Volley. Volley is an HTTP library that aims at removing lots of boilerplate code, simplifying the handling of images in lists, be faster, abstract the complexity of one or another HTTP client.

The presentation is here: <https://developers.google.com/events/io/sessions/325304728>

The code is here: <https://android.googlesource.com/platform/frameworks/volley/>

`git clone https://android.googlesource.com/platform/frameworks/volley` clones a valid Eclipse project ready to integrate in your app.

This post is a quick demo of the basic functions of Volley. It demonstrates the use of Volley with the JSON RESTful API from Sna.pr (see <http://developers.sna.pr/docs/api_basics/>). It will fetch JSON data from Sna.pr, extract the URLs to the images, display thumbnails in a GridView, and display the large image in another Activity.

All the code used in this demo is available here: <https://github.com/smaspe/SnaprVolley>.

# Initialization

Volley relies on a `RequestQueue`, that handle a queue of request, and on an `ImageLoader`, that is in charge of loading the images. We need one of each

```java
public static ImageLoader mImageLoader;
public static RequestQueue mRequestQueue;
```

We also need to initialize them. The queue needs a `Context`, the `ImageLoader` needs an `ImageCache`. Here, I use a basic wrapper to `LruCache<String, Bitmap>`.

```java
mRequestQueue = Volley.newRequestQueue(this);
mImageLoader = new ImageLoader(mRequestQueue, new BitmapLru(64000));
```

The initialization is done in the `onCreate()` of the first activity.

# Getting a JSONObject

The basic query on the Snapr API is search. Making a request using Volley is pretty straightforward. Simply add a `Request` object on the `RequestQueue`, add a `Listener` and that's it. In particular, the `JsonObjectRequest` returns a `JSONObject` in a callback.

```java
mRequestQueue.add(new JsonObjectRequest(SNAPR_URL, null,
    new Listener<JSONObject>() {
        @Override
        public void onResponse(JSONObject response) {
            // TODO handle the response
        }
}, new ErrorListener() {
    @Override
    public void onErrorResponse(VolleyError error) {
        error.printStackTrace();
    }
}));
```

The `JSONObject` received is handled in the `onResponse` method. (The Sna.pr API describes the detailed format of the response.)

```java
@Override
public void onResponse(JSONObject response) {
    if (!response.optBoolean("success", false)) {
        Log.w(TAG, "Request failed");
        try {
            Log.w(TAG, "Details " + response.toString(2));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return;
    }
    JSONArray images = null;
    try {
        images = response.getJSONObject("response")
                .getJSONArray("photos");
    } catch (JSONException e) {
        e.printStackTrace();
    }
    if (images != null) {
        for (int i = 0; i < images.length(); i++) {
            JSONObject object = images.optJSONObject(i);
            if (object == null) {
                continue;
            }
            String imageUrl = "http://media-server"
                    + object.optString("server_id") + ".snapr.us/thm2/"
                    + object.optString("secret") + "/"
                    + object.optString("id") + ".jpg";
            imageUrlAdapter.add(imageUrl);
        }
    }
}
```

The URL is passed to the `ImageUrlAdapter`, which is a simple `ArrayAdapter<String>` that populates a `GridView`.

# Getting an image in a GridView

The `ImageUrlAdapter` populates a `GridView` (or any `AdapterView`) with `NetworkImageView`. This is a class provided by Volley to put images from the network into an `ImageView`. It actually extends `ImageView`, meaning you can use it anywhere you use an `ImageView`. It is extremely simple to use. The only code in the adapter is the `getView`.

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {
    NetworkImageView imageView;
    if (convertView == null) {
        imageView = new NetworkImageView(getContext());
    } else {
        imageView = (NetworkImageView) convertView;
    }
    String url = getItem(position);
    imageView.setImageUrl(url, MainActivity.mImageLoader);
    return imageView;
}
```

The only new thing here is `imageView.setImageUrl(url, MainActivity.mImageLoader);`

That's it. Nothing more is required.

# Further stuff

The demo project also contains the `onItemClickListener` and the second activity to display the large image. Both are not discussed here as no other feature is used.

The `BitmapLru` is the simplest `ImageCache` possible. It is only a wrapper around `LruCache<String, Bitmap>`.

Using `POST`, adding a body and headers, custom `Request` objects are be discussed in the [next post]({% post_url 2013-06-06-volley-part2 %}).
