---
layout: post
title:  "String.format and Arabic numbers"
date:   2013-06-04
tags: android tips
description: Avoid a simple localization mistake by explicitly using a Locale
---
# Introduction

This post is about a simple mistake that can be made in the use of String.format. To illustrate this very common mistake, some android code from the `ContactsProvider`.

This code can be found here: <https://android.googlesource.com/platform/packages/providers/ContactsProvider/>

# Details

`String.format` allows formatting of Strings according to the following documentation <http://developer.android.com/reference/java/util/Formatter.html>

This is sometimes used for formatting SQLite queries in android. In particular, this is used in the `ContactsProvider`.

However, there is a pitfall in the use of `String.format` to format SQL queries.

Until Gingerbread release, the following lines are present in `ContactAggregator`:

```java
mRawContactsQueryByRawContactId = String.format(
        RawContactsQuery.SQL_FORMAT_BY_RAW_CONTACT_ID,
        MimeTypeIdPhoto, mMimeTypeIdPhone);
```

Where in `RawContactsQuery`, `SQL_FORMAT_BY_RAW_CONTACT_ID` contains 2 `%d` to be replaced by numbers in the `String.format`.

Here is the trap.

> 1. SQLite will expect these values to be Latin numbers or column names, because they are not quoted.
2. String.format uses the current locale unless explicitly specified.
3. In Arabic, %d results in Arabic numbers such as ١٢٣...

> Conclusion: If your locale is Arabic, SQLite searches for a column named after an Arabic number, which does not exist, and crashes.
This kind of issue will go totally unnoticed until you test your app with an Arabic locale.

Nota: the `Formatter` documentation clearly states this under the Number localization paragraph.

# Conclusion

The solution to avoid this is to force the locale to, for instance `Locale.US`. Incidentally, this is the solution implemented in ICS.

```java
mRawContactsQueryByRawContactId = String.format(Locale.US
        RawContactsQuery.SQL_FORMAT_BY_RAW_CONTACT_ID,
        mMimeTypeIdPhoto, mMimeTypeIdPhone);
```
