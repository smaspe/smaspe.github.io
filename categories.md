---
layout: page
title: Series
permalink: /categories/
---

# ***{{ page.title }}***
{% for category in site.categories %} 

{% assign category_name = category[0] %}
* [{{ category_name }}](#{{ category_name | slugify }})
{% endfor %}


{% for category in site.categories %} 

{% assign category_name = category[0] %}
# {{ category_name }}

{% assign posts = site.categories[category_name] %}
{% include post_list.html posts=posts %}

{% endfor %}
