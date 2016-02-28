---
layout: post
title:  "Publishing for Java (and Android)"
date:   2016-02-27
tags:
- open-source
- java
- android
description: Because an example is better than a long description
---
As mentioned in a [previous article]({% post_url 2016-02-25-publish-a-library %}), writing and publishing an open-source library is good for a lot of reasons.

There are a few things to do in order to make sure the publication of your library makes sense, here is how to do that in Java.

# Open sourcing
My library is [here](https://github.com/smaspe/FunctionalIterables). The issues are public and anyone can add one.

The shields on the readme page also indicate the public status of the testing, code coverage, and publication.

# Testing
For testing, I use [JUnit](http://junit.org/). It is the most common testing framework for plain Java.

To ensure that the tests are always run, I integrated the project with a [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) server. I chose [Travis CI](https://travis-ci.org/) because it integrates easily with GitHub. All is required is the `.travis.yml` file with the language declaration and the which JDK to use.

```yml
language: java
jdk: oraclejdk8
```

Whenever a commit is pushed on a branch, Travis pulls it, compiles it, runs the tests, and reports the result to GitHub. It ensures that you always know immediately when a branch does not compiles, or fails any test.

# Coverage
[JaCoCo](http://eclemma.org/jacoco/) is a code coverage library for Java. It generates XML and HTML reports based on the tests integrated in your project. It has a Gradle plugin, which adds a `jacocoTestReport` task. I add this task as a dependency of the `check` task, which already encompasses the `test` task, and is run by the CI server.

```groovy
apply plugin: 'jacoco'

jacocoTestReport {
    reports {
        xml.enabled = true
        html.enabled = true
    }
}
check.dependsOn jacocoTestReports
```

To make sense of the report, and to automatize the validation, I integrate [Codecov](https://codecov.io). Again, pretty easy, just send the result of the tests to Codecov using their provided script.

```yml
after_success:
  - bash <(curl -s https://codecov.io/bash)
```

You can then access other features, such as comparing the coverage from a branch to another, or rapidly see which parts of a pull request are not being tested. This is particularly important if you receive outside contributions to your project.

# Publication
Gradle build system uses Maven dependency management system, and connects to any maven repository. The most common are [Maven Central](https://search.maven.org/) and [jCenter](https://bintray.com/bintray/jcenter). I use jCenter because it is included by default in Android Studio in new Android projects.

To publish on jCenter, here is how

## Get an API key

1. Register on [Bintray](https://bintray.com/)
2. Get your API key from your [profile](https://bintray.com/profile/edit)
3. Add your username and API key to a file that you add to your `.gitignore`. The key is obviously secret and should not be shared with anyone.

```properties
bintray.user=smaspe
bintray.apikey=API key goes here
```

## Prepare the package
Publishing on jCenter requires that you include the JavaDoc and the source together with the build. There are a few things to add to your build file.

1. Include the `maven` and `maven-publish` plugins
2. To actually create the JavaDoc and the source bundle, define the `javadocJar` and `sourcesJar` tasks
3. Declare those tasks as being archives in the `artifacts` of the publication
4. Configure the `group` and `version` of your library

```groovy
group 'com.example.group'
version 'X.Y.Z'

apply plugin: 'maven'
apply plugin: 'maven-publish'

task javadocJar(type: Jar, dependsOn: javadoc) {
    classifier = 'javadoc'
    from 'build/docs/javadoc'
}

task sourcesJar(type: Jar) {
    from sourceSets.main.allSource
    classifier = 'sources'
}

artifacts {
    archives javadocJar
    archives sourcesJar
}
```

## Uploading

1. Get the jCenter plugin
2. Read the properties file with your API key
3. Configure the `bintray` task

```groovy
plugins {
    id "com.jfrog.bintray" version "1.4"
}

Properties properties = new Properties()
try {
    properties.load(project.rootProject.file('local.properties').newDataInputStream())
} catch (Exception ignored) {}

bintray {
    user = properties.getProperty("bintray.user")
    key = properties.getProperty("bintray.apikey")

    configurations = ['archives']
    pkg {
        repo = "maven"
        name = "The name of your library"
        publish = true
        // There are other parameters you can set, but only those are mandatory
    }
}
```

You now only have to call the tasks whenever you want to publish a new version

```nginx
./gradlew bintrayUpload
```

That's about it. Refer to my complete [Gradle file](https://github.com/smaspe/FunctionalIterables/blob/master/build.gradle) to see the complete configuration I use.
