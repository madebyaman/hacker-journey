---
layout: post-layout.njk
title: Learn How to Use Webpack 4 With JQuery and React
date: 2020-01-31
tags: ['Webpack', 'post']
excerpt: In the land of JS, bundlers like webpack, browserify are necessary evil. 
---
In the land of JS, bundlers like webpack, browserify are necessary evil. 

Webpack is one such tool. It processes your application, checks for all the dependencies that your project is using and based on that build one or more bundles. Not only that, you can also do code splitting, code transformations and so much more.

On top of that, Webpack is massively popular. Lot of companies are using Webpack because of the incredible customization it offers and its performance.

So let's dive in and learn about Webpack.

## Project 1: Setting up Webpack with JQuery

For the first project, we will be using Webpack to bundle to JQuery app. Let's start by cloning the project files from github repo.

As you can see this is very basic app, which inserts "Hello world". 

So go ahead and run `npm install` to install the dependencies. The first thing you'll notice when you open index.html in your browser is that it doesn't show anything.

That is because we have yet to install Webpack and bundle JQuery.

### Step 1: Install Webpack

In your terminal or command prompt, run:

    npm install webpack webpack-cli --save-dev

What is webpack-cli?

It is a command line interface that allows you to interact with webpack from your terminal.

### Step 2: Create Webpack Config File

Now, you need to create webpack.config.js file in the root of your project.

Now in webpack.config.js file, let's create entry and output point.

    const path = require("path");
    module.exports = {
      entry: path.join(__dirname + "/app.js"),
    
      output: {
        path: path.join(__dirname + "/"),
        filename: "bundle.js",
        publicPath: "/"
      },
    }

Let me explain the concept of entry and output point:

- Entry point is simply the place from where you want webpack to start bundling your code. Usually this is the JS file that you are loading into your page.
- While the output point is the place where Webpack will put all your bundled code.

Good? Let's keep moving.

### Step 3: Bundle with Webpack

Once you have created config file, you can simply run webpack in your command line or terminal to bundle your project in bundle.js.

    webpack

You can also set a script in your package.json file:

    "dev": "./node_modules/.bin/webpack --mode development"

With this you can simply run `npm run dev` or `yarn dev` to bundle your project.

## Project 2: Setting up Webpack with React

In this project, we will be using Webpack to bundle React code. So let's branch out and checkout to a branch named `React`:

    git checkout React

Now install the dependencies using `npm install`. If you now run the `npm run dev` you'll see an error like this:

![Learn%20How%20to%20Use%20Webpack%204%20With%20JQuery%20and%20React/Screen_Shot_2020-01-30_at_9.04.17_PM.png](Learn%20How%20to%20Use%20Webpack%204%20With%20JQuery%20and%20React/Screen_Shot_2020-01-30_at_9.04.17_PM.png)

This is because you need babel to work with JSX files. So let's do that.

### Step 1: Install Babel loaders

We need to install four babel dependencies:

1. babel-cli: It is required to work in command line
2. babel-loader: This is the loader needed to work with webpack
3. babel/core: This file contains most of the code for transformation
4. babel/preset-env: It will transform modern JS code so that browsers can read it
5. babel/preset-react: It transforms react specific things like JSX and so on.

So let's install them:

    npm install babel-cli babel-loader @babel/core @babel/preset-env @babel/preset-react --save-dev

### Step 2: Configure webpack file

You now need to use babel with webpack, so change your webpack.config.js to match the following:

    const path = require("path");
    
    module.exports = {
      entry: path.join(__dirname + "/app.js"),
    
      output: {
        path: path.join(__dirname + "/"),
        filename: "bundle.js",
        publicPath: "/"
      },
    
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {loader: 'babel-loader',
              options: {
              presets: ['@babel/preset-env',  '@babel/preset-react']
              }
            }
          }
        ]
    	}
    }

Now if you run `npm run dev` you'll successfully see the page loading. But we can further improve this project.

### How to load CSS?

At this point, if you try to create CSS file and import it into `app.js`, it won't work. Because Webpack doesn't know how to deal with this file.

Let's configure Webpack to load CSS files as well.

First you need to install `style-loader` and `css-loader`:

    npm install style-loader css-loader --save-dev

`style-loader` is webpack plugin that covers all the biolerplate to load .css, .scss, .less. While `css-loader` will resolve import calls to .css files.

After doing this, you again need to tell Webpack about this, so let's change the Webpack config file like so:

    const path = require("path");
    module.exports = {
      entry: path.join(__dirname + "/app.js"),
    
      output: {
        path: path.join(__dirname + "/"),
        filename: "bundle.js",
        publicPath: "/"
      },
    
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
              }
            }
          },
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }, { loader: "css-loader" }]
          }
        ]
      }
    };

Let's create a style.css file:

    body {
    	background: acqua;
    }

And import it into app.js file like so:

    import './style.css';

### How to install Webpack Dev Server?

I'm sure you must have been fed up by opening your index.html file in your browser. Let's solve that issue by using `webpack-dev-server`.

First, install the dev server by running the following command in your terminal:

    npm install webpack-dev-server -D

Next, change dev script in your `package.json` file like so:

    "dev": "./node_modules/.bin/webpack-dev-server --mode development"

Now if your run `npm run dev` you can use go to [http://localhost:8080/](http://localhost:8080/) to view your page.

### How to create production build?

Until now, we have only been creating a development build. But we need to create production build if we want to deploy the project.

To do this, we first need to install uglifyjs-webpack-plugin. This plugin will create minify the code, so as to make sure it is as small as possible.

    npm install uglifyjs-webpack-plugin --save-dev

Next, you want to add it your config:

    const path = require("path");
    const UglifyPlugin = require("uglifyjs-webpack-plugin");
    
    module.exports = {
      entry: path.join(__dirname + "/app.js"),
    
      output: {
        path: path.join(__dirname + "/"),
        filename: "bundle.js",
        publicPath: "/"
      },
    
      optimization: {
        minimizer: [new UglifyPlugin()]
      },
    
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
              }
            }
          },
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }, { loader: "css-loader" }]
          }
        ]
      }
    };

 Once that's done, lets add another script to `package.json` file:

    "build": "./node_modules/.bin/webpack --mode production"

That's it!

If you now run, `npm run build` , the `bundle.js` will be minified, unreadable code and that's what we need for production.

## Conclusion

Congratulations.

Now you know the basic of webpack. You can easily configure a project and get started using Webpack. 

But your learning doesn't end here. The technologies move fast and you should keep up with it. You can follow [official webpack documentation](https://webpack.js.org/concepts/) to keep up with this fast changing environment.