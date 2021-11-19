---
layout: post-layout.njk
title: Copywriter WP WordPress Theme
date: 2021-11-12
tags: ["Wordpress", "Theme", "project"]
excerpt: Copywriter WP is a WordPress theme made from scratch.
---

Copywriter WP theme contains bunch of features that I would like to elaborate on:

## Custom Theme

First off, it is custom theme developed from scratch. It is not based on any starter theme. It contains all the essential Template files like index.php, header.php, footer.php, home.php, single.php, singular.php etc.

The `functions.php` contains important code like loading in CSS and JS, adding theme support for various features, and registering menu and sidebar.

## Menu

Displaying menu is often difficult on mobile devices. Copywriter WP contains JS in `js/navigation.js` which triggers a button to load menu on mobile phones.

## Custom Post

The theme also contains a custom post named "Projects" and custom taxonomy "Skills". You can look at its code in the `includes/custom-posts.php`.

For displaying its content, I added the necessary templates:

- `archive-project.php`: For displaying portfolio archive pages.
- `single-project.php`: For displaying single project
- `taxonomy-skills.php`: For displaying skills archive page.

## Advanced Custom Fields

For the custom post "Project", I also added a custom field named "URL".
I used Advanced Custom Fields plugin for doing this.
After doing that I attached ACF plugin with the theme so the theme user doesn't need to install ACF plugin.

You can find the code for ACF in `functions.php` from line 42.
