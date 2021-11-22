---
layout: post-layout.njk
title: Copywriter WP WordPress Theme
date: 2021-11-12
tags: ["Wordpress", "Theme", "project"]
excerpt: Copywriter WP is a WordPress theme made from scratch.
---

Copywriter WP theme contains a bunch of features that I would like to elaborate on:

## Custom Theme

First off, it is a custom theme developed from scratch. It is not based on any starter theme. It contains all the essential Template files like index.php, header.php, footer.php, home.php, single.php, singular.php, etc.

```tree
├── 404.php
├── README.md
├── archive-project.php
├── category.php
├── comments.php
├── footer.php
├── functions.php
├── header.php
├── home.php
├── includes
│   ├── advanced-custom-fields
│   └── custom-posts.php
├── index.php
├── js
│   └── navigation.js
├── node_modules
├── package-lock.json
├── package.json
├── portfolio.md
├── readme.txt
├── sass
├── screenshot.png
├── single-project.php
├── single.php
├── singular.php
├── style.css
├── style.css.map
├── taxonomy-skills.php
└── template-parts
    ├── content-none.php
    ├── content-page.php
    ├── content-posts.php
    ├── content-projects.php
    ├── content-single.php
    ├── content.php
    └── project.php
```

The `functions.php` contains important code like loading in CSS and JS, adding theme support for various features, and registering menu and sidebar.

## Menu

Displaying a menu is often difficult on mobile devices. Copywriter WP contains [JS fpr displaying mobile menu](https://github.com/madebyaman/copywriter-wp-theme/blob/main/js/navigation.js) in `js/navigation.js` . It triggers a button to load the menu on mobile phones.

![Menu of Copywriter WP Theme](/static/images/menu-copywriter-wp-theme.png)

## Custom Post

The theme also contains a custom post named "Projects" and a custom taxonomy "Skills". You can look at its code in the [includes/custom-posts.php](https://github.com/madebyaman/copywriter-wp-theme/blob/main/includes/custom-posts.php).

![Custom post "Projects" in Copywriter WP Theme](/static/images/custom-post.png)

For displaying its content, I added the necessary templates:

- `archive-project.php`: For displaying portfolio archive pages.
- `single-project.php`: For displaying the single project
- `taxonomy-skills.php`: For displaying skills archive page.

## Advanced Custom Fields

For the custom post "Project", I also added a custom field named "URL". I used the Advanced Custom Fields plugin for doing this.

After doing that I attached the ACF plugin files with the theme so the theme user does not need to install the ACF plugin.

```php
<a class="url-button" href="<?php the_field('url'); ?>" target="_blank">
  <?php esc_html_e('Visit the project', 'copywriter'); ?> &rarr;
</a>
```

You can find the code for ACF in [functions.php](https://github.com/madebyaman/copywriter-wp-theme/blob/main/functions.php) from line 42.

[Visit the GitHub repository >>](https://github.com/madebyaman/copywriter-wp-theme)

[Visit the live site >>](http://copywriter.unfiddle.com/)
