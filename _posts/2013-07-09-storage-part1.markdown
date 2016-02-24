---
layout: post
title:  "Storage is simple – Part 1, SQL"
date:   2013-07-09
tags: android demo sqlite
description: A quick take on how to design a very small storage library
---
A lot of apps use SQLite, usually to store data from webservice, most of the time, modern webservices are JSON RESTful APIs.

Without the help of a library, this lead to a tremendous amount of boilerplate code, repeated and almost identical from an application to another: create and update a database, create model to access the webservice, map the data in database, make requests helpers...

When one looks at the code for all this, one sees a lot of redundancy: the same term is often used for an object attribute in JSON, Java, SQL. A object name is a class name and a table name.

With a little convention and some code reflection, it is not very complicated to factorize all this code in a simple SQLite-JSON-helping library.

This first post is about the SQLite part. The next post will cover the connection with JSON.

All code demonstrated here is available at github: <https://github.com/smaspe/SimpleStorage>

# Disclaimer

This is more a demo than an actual library, as it lacks features and heavy testing. Please don't use it in real life application without actual testing.

This library is simple. It does not do relations (yet), nor caching, nor does it handle all that many datatypes.

# Guess the schema for an object

The first thing to do when you want to save something in SQLite is to know what SQL schema to use. A little reflection and the schema is guessed in 25 lines with a little help from `TypeHandlers` (more on them later)

{% gist smaspe/5804112 %}

All declared members are added in the schema, which makes sense since we would be saving a Model object.

# Access the database

`ContentProvider` is pretty much required since the apparition of Loaders.

For the sake of simplicity, only one database is used, and tables are given by the `Storable` classes names. Therefore, the `ContentProvider` matches "*" (any table name) and "*/#" (any table name with an id afterward).

The `ContentProvider` is the biggest part, as it contains the actual implementation for insert, update, query and delete. Mostly, its role is to:

- Identify the type of request, by table name and id or by table name directly
- Identify the table on which to work
- Perform the actual query/insert/update/delete
- Return the result

The implementation is 150 lines, so it is not pasted here. Instead, it can be found here: [DataProvider.java](https://github.com/smaspe/SimpleStorage/blob/master/SimpleStorage/src/com/njzk2/simplestorage/DataProvider.java)

# Put an object in database

An Object is a list of attributes with names. So is a database row. The complex part is to put the Object in a `ContentValues`. It is done using the Map trick described earlier.

{% gist smaspe/5804159 %}

Again, a little help from `TypeHandlers`.

The object can now be sent to the `ContentProvider`.

# Retrieve an object

To retrieve an object, one only needs the Class of the object, and its id in database.

{% gist smaspe/5948933 %}

`getById` queries the `ContentResolver` for the `Cursor` representing the object, and then `loadCursor` puts the values in the object, again with the help of `TypeHandlers`.

# Update an object

Update works exactly as save, except an update is performed instead of an insert.

# Delete an object

Deleting is quite simple, as it is a simple call to the `ContentProvider`.

{% gist smaspe/5949121 %}

# TypeHandlers

I have been using `TypeHandlers` for a while without explaining what they do. From their use, it should be pretty straightforward. They are objects that provide column type, database column formatting/extracting based on an object type. The default implementation is

{% gist smaspe/5949014 %}

which works for `Strings`. `TypeHandlers` are matched against the class of the being-saved object, which means that you need to provide custom `TypeHandlers` for all types of members in your `Storable` object. Usually the implementation of such a handler is no more than 10-20 lines, and if I were to keep working on this library, I would quickly add all the basic ones (numbers, dates, strings, blobs, arrays of the previous ...).

The use of dedicated classes for handlers makes it easy to add a custom handling for a specific class or for a class that is not already supported.

# Conclusion

With only 6 classes of less than 150 lines each (around 450 lines total), this demonstrate how fairly easy a generic and expandable storage system can be.

I tried to show that in most cases, declaring an actual table name, column names and have lengthy methods for putting objects in `ContentValues` and retrieving them from a Cursor is not worth it.

Having a generic system that bases itself directly on the names of the variables and of the classes prevent any typo, eases maintenance by clearly separating the storage layer, and makes it reusable for any other project.

# Further development

In its current state, it is not quite ready to use. It lacks optimization, caching of objects, relations between objects (which requires caching). If I ever get to write them, next posts will cover the testing of such a library, use examples, and integration with JSON webservices.
