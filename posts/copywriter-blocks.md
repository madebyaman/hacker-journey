---
layout: post-layout.njk
title: WordPress Blocks Plugin
date: 2021-11-12
tags: ["Wordpress", "Gutenberg", "project", "plugin"]
excerpt: This is a plugin containing 5 blocks for Copywriter WP Theme.
---

This plugin contains 5 blocks.

All of them are highly customizable and translation-ready. Nearly all of them offers support for:

- Changing text alignment
- Changing background color
- Changing width

The alignment is controlled by adding `BlockControls` like this:

```js
<BlockControls>
  <AlignmentToolbar
    value={contentAlignment}
    onChange={(val) => setAttributes({ contentAlignment: val })}
  />
</BlockControls>
```

Support for width is added in `block.json` by:

```json
"supports": {
  "align": ["full", "wide"]
},
```

## Author Bio

![Author Block](/static/images/author.png)

This block allows the user to change background color, text color. This is achieved by using the `InspectorControls` component:

```js
<InspectorControls>
  <PanelBody title={__("Background Settings", "copywriter-blocks")}>
    <div className="components-base-control">
      <div className="components-base-control__field">
        <label className="components-base-control__label">
          {__("Background Color", "copywriter-blocks")}
        </label>
        <ColorPalette
          value={backgroundColor}
          onChange={(val) => setAttributes({ backgroundColor: val })}
        />
      </div>
    </div>
    <div className="components-base-control">
      <div className="components-base-control__field">
        <label className="components-base-control__label">
          {__("Text Color", "copywriter-blocks")}
        </label>
        <ColorPalette
          value={textColor}
          onChange={(val) => setAttributes({ textColor: val })}
        />
      </div>
    </div>
  </PanelBody>
</InspectorControls>
```

## Brand Logos

![Brand Logos Block](/static/images/brand-logos.png)
This block displays 3 brand logos. Their customization options include:

- Opacity
- Background Color

In this block, I used a `RangeControl` component which controls the opacity for these images:

![Opacity options for images of brand logos block](/static/images/opacity-control.png)

```js
<RangeControl
  label={__("Images opacity", "copywriter-blocks")}
  value={opacity}
  onChange={(val) => setAttributes({ opacity: val })}
  min={0}
  max={100}
  step={10}
/>
```

## Call To Action

![Call to Action Block](/static/images/call-to-action.png)
This block is a simple block that displays a title and a button. It offers the user to customize background color and button colors.

The unique feature I added in this block is support for changing button size and button rounding options.

![Button size and shape options for call to action block](/static/images/button-size-and-shape.png)

I did this by first adding button options:

```js
const buttonSizeOptions = [
  { value: "cw-button-size-small", label: __("Small") },
  { value: "cw-button-size-medium", label: __("Medium") },
  { value: "cw-button-size-large", label: __("Large") },
  { value: "cw-button-size-extralarge", label: __("Extra Large") },
];

// Button shape
const buttonShapeOptions = [
  { value: "cw-button-shape-square", label: __("Square") },
  { value: "cw-button-shape-rounded", label: __("Rounded Square") },
  { value: "cw-button-shape-circular", label: __("Circular") },
];
```

Then calling them through the `SelectControl` component:

```js
<SelectControl
  label={__("Button Size", "copywriter-blocks")}
  value={buttonSize}
  options={buttonSizeOptions.map(({ value, label }) => ({
    value,
    label,
  }))}
  onChange={(val) => setAttributes({ buttonSize: val })}
/>
<SelectControl
  label={__("Button Shape", "copywriter-blocks")}
  value={buttonShape}
  options={buttonShapeOptions.map(({ value, label }) => ({
    value,
    label,
  }))}
  onChange={(val) => setAttributes({ buttonShape: val })}
/>
```

## Hero Block

![Hero Block](/static/images/hero-block.png)
Hero block is highly customizable. It offers customization options like:

- Adding background image
- Changing font size
- Changing button colors

Besides these customization options, I also added custom styles in the `block.json` file. This allows the user to quickly modify the look of the block without changing options.

![different styles for hero block](/static/images/styles-for-hero-block.png)

I did this by first adding styles in `block.json`:

```json
"styles": [
  {
    "name": "main",
    "label": "Main Style"
  },
  {
    "name": "dark",
    "label": "Dark Style"
  },
  {
    "name": "minimal",
    "label": "Minimal (Default)",
    "isDefault": true
  }
]
```

Then adding CSS Custom Properties which can be found in the `style.scss` file:

```css
.wp-block-copywriter-blocks-hero-block {
  &.is-style-main {
    --copywriter-hero-block-bg-color: linear-gradient(
      160deg,
      #0093e9 0%,
      #80d0c7 100%
    );
    --copywriter-hero-block-opacity: 20%;
    --text-color: white;
  }

  &.is-style-dark {
    --copywriter-hero-block-opacity: 20%;
    --copywriter-hero-block-bg-color: #32373c;
    --text-color: white;
    --primary-button-bg-color: white;
    --primary-button-color: #32373c;
    --secondary-button-border-color: white;
    --secondary-button-color: white;
  }

  &.is-style-minimal {
    --copywriter-hero-block-bg-color: #fff;
    --copywriter-hero-block-opacity: 100%;
    --text-color: #32373c;
    --primary-button-bg-color: #32373c;
    --primary-button-color: #fff;
    --secondary-button-border-color: #32373c;
    --secondary-button-color: #32373c;
  }
}
```

## Testimonial Block

![Testimonial Block](/static/images/testimonial.png)
Testimonial block supports displaying content, image, and title. Besides, it supports changing border color and border size.

The interesting bit of code I added to this block is the ability to remove an image. When a person uploads the Testimonial image in the editing interface, they can click this cross icon to remove the selected image:
![icon that removes selected image in testimonial block](/static/images/testimonial-cross.png)

This is done by this piece of code in `edit.js`:

```js
{
  mediaID && (
    <Icon
      icon="dismiss"
      className="testimonial-image-edit-icon"
      onClick={onRemoveImage}
    />
  );
}
```

[Visit the GitHub repository >>](https://github.com/madebyaman/copywriter-blocks)
