---
layout: post
title:  "Map to ContentValues (Abusing Parcelable)"
date:   2013-05-31
categories: android
---
This post is about removing some of the pain from inserting JSON into SQLite (or any Map thing to any ContentValues-based system) and vice-versa.

[`ContentValues`](https://developer.android.com/reference/android/content/ContentValues.html) is the proper way to give SQLite data to insert. However, the methods for putting stuff in it are typed. It has to be an `int`, a `String`... and you have to know the type of `Object` you are inserting.

That's good, because you are not supposed to put anything else in a `ContentValues`.

That's no so good, because in the end, it is simply a `Map` that holds the data no matter what you give it. It add complexity with little gain.

It can happen that you have data you want to insert, you know you only have valid data types, but you don't know which is which.

For example, you receive a `JSONObject` from a webservice that you need to insert or update.

`Parcelable` comes to the rescue.

Parceling a `ContentValues` only parcels the underlying `HashMap`, and unparceling then calls the private constructor `ContentValues(Map)`. The trick is to parcel a `HashMap`, and then unparcel it as a `ContentValues`. Voilà.

### Map to ContentValues

``` java
Parcel parcel = obtain();
parcel.writeMap(map);
parcel.setDataPosition(0);
ContentValues values = ContentValues.CREATOR.createFromParcel(parcel);
```

For example, your map could come from a `JSONObject`:

### JSONObject to Map

``` java
Map<String, Object> map = new HashMap<String, Object>();
for (String key : jObj.keys()) {
    map.put(key, jObj.get(key);
}
```

`map` can then be inserted in database (provided you are sure of your data structure).

### Note regarding unsupported types

`ContentValues` can be used in different use cases, but in the case of SQLite, `SQLiteConnection.bindArguments` tends to indicate that default behavior with unknown `Object` types is to `toString` them.

Please note that the reverse operation works as well, meaning it is quite easy to put a `ContentValues` into a `JSONObject` (or any other formatting that takes a Map as input)

It is also possible to use reflection to access the `Map` field from the `ContentValue` and get/set it. However, I find reflection is cumbersome in Java (although probably more efficient in this case).
