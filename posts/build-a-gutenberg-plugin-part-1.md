---
layout: post-layout.njk
title: Part 1 - How to Build a Gutenberg Block Plugin in Wordpress
date: 2021-11-12
tags: ["Wordpress", "Gutenberg", "post"]
excerpt: In this tutorial we will create a basic Hero block for Gutenberg Editor.
---

I recently finished reading [Writing to Learn](https://www.goodreads.com/book/show/585474.Writing_to_Learn) book by William Zinsser. The book made me realize the importance of writing as an important step in learning.

Also since I often find myself looking at the Gutenberg Handbook and the its Github repo, I want to use this blog post as a base for my next project.

In this tutorial we will create a basic Hero block for Gutenberg Editor.

![](https://paper-attachments.dropbox.com/s_C2D426647B1FDC7329AC5047003CABD739C0E88BF9A4DCE13C6C53C2DB1F3405_1636456520048_CleanShot+2021-11-09+at+16.44.51.png)

While creating this block, we will learn some basic concepts like:

- setting up boilerplate
- `edit.js` and `save.js` files
- `block.json` file
- creating styles

Let's dive in.

## Step 1: Getting Started

First step is to have some boilerplate to get started. Some of the ways to do this:

1. [WP CLI scaffold](https://github.com/wp-cli/scaffold-command) command
2. [create-guten-block](https://github.com/ahmadawais/create-guten-block) by Ahmad Awais
3. Use [gutenberg-examples](https://github.com/WordPress/gutenberg-examples/tree/trunk/05-recipe-card-esnext) repo as a starting point.

But I wouldn't recommend these methods.

- WP CLI scaffold is [no longer recommended by WP](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/generate-blocks-with-wp-cli/).
- `create-guten-block` isn't recommended by WordPress since it's not up to date.
- I also found some glitches in `gutenberg-examples` repo.

I'd recommend using `@wordpress/create-block`, it has all the necessary files. Plus, you don’t have to deal with module bundler like Webpack, which can be a big headache.

Start by running the following command in your `plugins` folder.

```sh
npx @wordpress/create-block test-hero-block
cd test-hero-block
```

Now open the plugin in your favorite code editor. If you look at `package.json`, you'll find all the necessary scripts to compile your js and css.

Run `npm run start` to start the build process.

## Step 2: Setting Attributes

Let's break down the hero block to various components:

- First, we have a heading section with the `h1` tag.
- We also have a paragraph section.
- Finally, we have two buttons to get visitors to take action.
  ![](https://paper-attachments.dropbox.com/s_C2D426647B1FDC7329AC5047003CABD739C0E88BF9A4DCE13C6C53C2DB1F3405_1636849282941_attributes.png)

We will get started by editing `block.json` which simply contains [metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/) about the block you are building.
Open `block.json` in the root folder. You need to edit it to make it look like this.

```json
{
  "apiVersion": 2,
  "name": "create-block/test-hero-block",
  "version": "0.1.0",
  "title": "Test Hero Block",
  "category": "layout",
  "icon": "design",
  "description": "A hero block created for learning purposes.",
  "supports": {
    "html": false
  },
  "attributes": {},
  "textdomain": "test-hero-block",
  "editorScript": "file:./build/index.js",
  "editorStyle": "file:./build/index.css",
  "style": "file:./build/style-index.css"
}
```

Here I did I updated few fields:

- Name of a block is unique string and must be structured as `namespace/block-name` where namespace is name of plugin or theme. If you want to change the block name, make sure to change it in `index.js` file inside `src/` as well.
- Title is the name that will be visible in the Gutenberg editor.
- I updated the category to layout. You can also create your own custom category, [see documentation](https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#managing-block-categories).
- I also update the icon from "smiley" to "index-card" as it best explains the block we are creating. See [list of available icons](https://developer.wordpress.org/resource/dashicons/)
- I also updated the description.
- Supports is important property to declare features to be used in the editor. [Check its documentation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- Text domain field is used for translation purposes.

If you look carefully, I've also added an attributes field. [Attributes](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/) store the important information of a block. If you're familiar with React, it's similar to [React state](https://beta.reactjs.org/reference/usestate). It is a crucial piece in your plugin.
Let's add few attributes inside "attributes":

```json
    "attributes": {
      "title": {
        "type": "string",
        "source": "html",
        "selector": "h1"
      },
      "content": {
        "type": "string",
        "source": "html",
        "selector": ".text"
      },
      "primaryButtonText": {
        "type": "string"
      },
      "primaryButtonURL": {
        "type": "string",
        "source": "attribute",
        "selector": "a.primary",
        "attribute": "href"
      },
      "secondaryButtonText": {
        "type": "string"
      },
      "secondaryButtonURL": {
        "type": "string",
        "source": "attribute",
        "selector": "a.secondary",
        "attribute": "href"
      }
    }
```

That's it for this file. Now, move on to `edit.js` file inside the `src/` directory.

## Step 2: Setting Edit.js file

This file is used by WP inside the block editor. It lets you customize the editing interface in the editor.
Start by importing few things we require from WordPress:

```js
import { RichText, URLInput, useBlockProps } from "@wordpress/block-editor";
import { Button, Icon } from "@wordpress/components";
```

We require `RichText` to allow capturing text, `URLInput` allows us to capture URL.`Button` and `Icon` are a WP components to display button and icon in the editing interface.

Edit the `Edit()` function so it looks like this:

```js
export default function Edit(props) {
  const {
    attributes: {
      title,
      content,
      primaryButtonText,
      primaryButtonURL,
      secondaryButtonText,
      secondaryButtonURL,
    },
    isSelected,
    setAttributes,
  } = props;

  return (
    <div {...useBlockProps()}>
      <div className="test-hero-block"></div>
    </div>
  );
}
```

Let’s look at what I did here:

- Accept props in the function.
- `isSelected` is an important prop that tells whether the current block is selected.
- `setAttributes` is a function which allows us to update these attributes.
- I also destructured the attributes.
- Finally, replace the `p` tag with `div` tag.

In the return call, first let's add the `<RichText />` component.

```js
<div {...useBlockProps()}>
  <div className="test-hero-block">
    <RichText
      tagName="h1"
      placeholder={__("Hero Title", "test-hero-block")}
      value={title}
      onChange={(val) => setAttributes({ title: val })}
    />
  </div>
</div>
```

Here's how it works:

- `tagName` is set to `h1` which matches the selector given for `"title"` attribute in `block.json` file
- `value` is set to `title`
- `onChange` calls this function and changes the value of `title` on input.

You can read more about `RichText` component in the [documentation](https://developer.wordpress.org/block-editor/reference-guides/richtext/).

Now, let's add one more `RichText />` component for `content` attribute.

```js
<RichText
  tagName="div"
  multiline="p"
  placeholder={__("Enter content", "test-hero-block")}
  className="text"
  value={content}
  onChange={(val) => setAttributes({ content: val })}
/>
```

The only changes are `tagName` to `div`, `multiline` to `p` which basically ensures user to enter multiple paragraph inside the `div` tag.

I also added `className` property which matches the selector for `"content"` attribute in `block.json`. It is super important, otherwise the block will throw multiple errors.

Finally let's add code for primary button:

```js
    <div className="buttons">
      <div className="primary-button">
          <RichText
              tagName="span"
              placeholder={__("Button text...", "test-hero-block")}
              value={primaryButtonText}
              allowedFormats={[]}
              className="primary button"
              onChange={(val) => setAttributes({ primaryButtonText: val })}
          />
          {isSelected && (
              <form key="form-link" onSubmit={(e) => e.preventDefault()}>
                  <URLInput
                      value={primaryButtonURL}
                      onChange={(val) => setAttributes({ primaryButtonURL: val })}
                  />
                  <Button label={__("Apply", "test-hero-block")} type="submit">
                      <Icon icon="editor-break" />
                  </Button>
              </form>
          )}
    </div>
```

Here we are using `RichText` to edit button text. Inside `RichText`, there is `allowedFormats` prop which I've set to empty array. It removes the bold, italic, underline options which we don't want for a button.

The second part is interesting. Here we are displaying a `form` which contains `URLInput` and `Button` to get the url for button. The form displays only if block is selected which we are getting from `isSelected` attribute.

Repeat the same for secondary button and you are done with `edit.js`.

## Step 4: Save.js File

`save.js` file displays the block on front-end. It is much easier compared to `edit.js` file.

Here is how it works:

```js
export default function save(props) {
  const {
    attributes: {
      title,
      content,
      primaryButtonText,
      primaryButtonURL,
      secondaryButtonText,
      secondaryButtonURL,
    },
  } = props;
  return (
    <div {...useBlockProps.save()}>
      <div className="test-hero-block">
        {title && <RichText.Content tagName="h1" value={title} />}
        {content && (
          <RichText.Content tagName="div" className="text" value={content} />
        )}
        <div className="buttons">
          {primaryButtonText && (
            <div className="primary-button">
              <a href={primaryButtonURL} className="primary button">
                <RichText.Content value={primaryButtonText} />
              </a>
            </div>
          )}
          {secondaryButtonText && (
            <div className="secondary-button">
              <a href={secondaryButtonURL} className="secondary button">
                <RichText.Content value={secondaryButtonText} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

If you look at it, it's pretty basic. We are destructuring all the variables and displaying them in the return call.

`<RichText.Content />` allows us to display the rich text value. Make sure to import `RichText` component like we imported in `edit.js` file.

I am using using `&&` statements to display the block only if there are values available.

## Step 5: Adding Styles

If you open the block editor, you can add the block and also view it on frontend. But it doesn't look nice.

Let's add some styles. Start by adding some styles inside `style.scss` file:

```css
.test-hero-block {
  padding: 100px 0 120px;
  text-align: center;
  width: 100%;

  .text {
    margin: 40px 0 50px;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 25px;

    .button {
      padding: 15px 25px;
      background-color: #32373c;
      border-radius: 100px;
      cursor: pointer;
      color: white;

      &.secondary {
        border: 2px solid #32373c;
        color: #32373c;
        background-color: transparent;
      }

      &:hover {
        box-shadow: inset 0 0 200px rgba(255, 255, 255, 0.15);
      }
    }
  }
}
```

Open the `editor.scss` to add styles for improving editing styles:

```css
.test-hero-block {
  input {
    margin-top: 10px;
    color: #777;
    border-radius: 3px;
    padding: 2px;

    &:focus {
      color: #333;
    }

    button {
      padding: 10px 15px;
      background-color: #32373c;
      cursor: pointer;
      color: white;

      &:hover {
        box-shadow: inset 0 0 200px rgba(255, 255, 255, 0.15);
        color: white;
      }
    }

    .button {
      cursor: text;
    }
  }
}
```

Congrats you have successfully created a simple hero block which you can add to a post or a page. You can now be proud of what you've created.

In the second part, we will learn about advanced topics like adding media, inspector controls, alignment toolbar etc.
