---
layout: post-layout.njk
title: WordPress Blocks Plugin
date: 2021-11-12
tags: ["Wordpress", "Gutenberg", "project", "plugin"]
excerpt: This is a plugin containing 5 blocks for Copywriter WP Theme.
---

This plugin contains 5 blocks.

All of them are highly customizable and translation ready. Nearly all of them offers support for:

- Changing text alignment
- Changing background color
- Changing width

Let's see their unique functionality.

## Author Bio

![Author Block](/static/images/author.png)

This block allows user to change

- Background color
- Content alignment
- Select and remove author image

## Brand Logos

![Brand Logos Block](/static/images/brand-logos.png)
This block displays 3 brand logos. Their customization options include:

- Opacity
- Background Color

## Call To Action

![Call to Action Block](/static/images/call-to-action.png)
This block is a simple block which displays title and a button. It offers user to customize background color, and button colors.

The unique feature I added in this block is support for changing button size and button rounding options.

## Hero Block

![Hero Block](/static/images/hero-block.png)
Hero block is highly customizable. It offers customization options like:

- Adding background image
- Changing font size
- Changing button colors

Besides these customization options, I also added custom styles in `block.json` file. This allows user to quickly modify the look of the block without changing options.
It uses CSS Custom Properties which can be found in `style.scss` file from line 18.

## Testimonial Block

![Testimonial Block](/static/images/testimonial.png)
Testimonial block supports displaying content, image, and title.
Besides, it supports changing border color and border size.
