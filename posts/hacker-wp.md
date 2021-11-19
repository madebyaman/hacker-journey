---
layout: post-layout.njk
title: Hacker WP WordPress Theme
date: 2021-11-17
tags: ["Wordpress", "Theme", "project"]
excerpt: A WP theme based on underscores.
---

It is based on Underscores Starter Theme. I designed this theme myself. It is a 2-column theme and becomes one column on mobile devices.

I want to bring your attention to 3 features I added to the theme:

## Widget areas

There is a custom widget registered in the `functions.php`:

```php
function hacker_wp_widgets_init()
{
    register_sidebar(
        array(
            'name'          => esc_html__('Sidebar', 'hacker-wp'),
            'id'            => 'sidebar-1',
            'description'   => esc_html__('Add widgets here.', 'hacker-wp'),
            'before_widget' => '<section id="%1$s" class="widget %2$s">',
            'after_widget'  => '</section>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        )
    );
}
add_action('widgets_init', 'hacker_wp_widgets_init');
```

It is displayed by `sidebar.php`.

```php
<?php dynamic_sidebar( 'sidebar-1' ); ?>
```

## Google Fonts

I have added custom fonts from Google Fonts library:

```php
wp_enqueue_style('hacker-wp-fonts', 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&family=Source+Sans+Pro:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap', ['hacker-wp-style'], HACKER_WP_VERSION);
```
