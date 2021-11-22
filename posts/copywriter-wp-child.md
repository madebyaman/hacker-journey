---
layout: post-layout.njk
title: Child Theme
date: 2021-11-12
tags: ["Wordpress", "Theme", "project"]
excerpt: This is a child theme of Copywriter WP Theme.
---

This is a child theme based on the Copywriter WP Theme.

I improved the design of blog archive and individual blog post pages.
![Individual Blog Post page for Copywriter WP Child Theme](/static/images/individual-blog.png)

Other than design changes, I also added the widget areas for front page and site footer. In these widget areas, theme user can add blocks using Copywriter Blocks plugin to make the theme look much more polished.

```php
<?php if ( is_active_sidebar( 'front-widget' )) : ?>
  <?php dynamic_sidebar( 'front-widget' ); ?>
<?php endif; ?>
```

[Visit the live site>>](http://copywriter-child.unfiddle.com/)

[Visit the GitHub repository>>](https://github.com/madebyaman/copywriter-wp-child)
