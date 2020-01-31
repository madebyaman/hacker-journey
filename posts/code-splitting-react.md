---
layout: post-layout.njk
title: How to use Code Splitting in React?
date: 2020-01-31
tags: ['React']
---
A large or even a medium sized react application contains tons of components, and methods all trying to run at the same time. This can be a problem as your application will take longer to run and might not even start on a low bandwidth network.

Using code splitting, you can configure your React application so it doesn't load all the components at one ago, instead it defers the loading of components until they are required.

Let's see how its done.

## First way: import call

The simplest way to defer loading of your components is through dynamic `import()`.

    import {About} from './about'
    import {Home} from './home'

    const Router = () => (
    		<Switch>
          <Route path="/about">
    		    <About />
          </Route>
          <Route path="/">
    	      <Home />
          </Route>
        </Switch>)

Let's say you want to delay the loading of `about.js` until about route has not been loaded.

    import {Home} from './home'

    const Router = () => (
    		<Switch>
          <Route path="/about">
    		    import("./about.js").then(about => about);
          </Route>
          <Route path="/">
    	      <Home />
          </Route>
        </Switch>)

Now rest of the work will be taken care by Webpack. If you've configured webpack yourself then you might need to read this guide.

[https://webpack.js.org/guides/code-splitting/](https://webpack.js.org/guides/code-splitting/)

## Second way: React.lazy

`React.lazy` is the best method to do this for you. It makes it super easy to do this on a component level.

    import React, { lazy } from 'react';

    const About = lazy(() => import('./About'));

    const Router = () => (
    		<Switch>
          <Route path="/about">
    		    <About/>
          </Route>
          <Route path="/">
    	      <Home />
          </Route>
        </Switch>
    )

Although `React.lazy` is a wonderful way to lazy load your components, but with lazy loading your users will experience slight delay when fetching components.

This can be solved by using `Suspense`.

Here is how it works.

    import React, { lazy, Suspense } from 'react';

    const About = lazy(() => import('./About'));

    const loadingState = () => <p>Loading</p>;

    const Router = () => (
    		<Switch>
          <Route path="/about">
    				<Suspense fallback={loadingState()}>
    			    <About/>
    				</Suspense>
          </Route>
          <Route path="/">
    	      <Home />
          </Route>
        </Switch>
    )

Suspense loads a loading state while your component is being fetched. This allows you to draw a super cool animation on the page.

### How to suspend multiple components?

One of the coolest feature of `Suspense` is that **it allows you to suspend multiple components even if all of them are being lazy loaded and fetched at a different time.**

This means, if you have some kind of animation for your loading screen then you can `Suspense` to show a single loading page for all of them.

    import React, { lazy, Suspense } from 'react';

    const About = lazy(() => import('./About'));

    const Users = lazy(() => import ('./Users'));

    const Dashboard = lazy(() => import ('./Dashboard'));

    const loadingState = () => <p>Loading</p>;

    const Router = () => (
    		<Switch>
          <Route path="/about">
    				<Suspense fallback={loadingState()}>
    			    <About/>
    				</Suspense>
          </Route>
    			<Route path="/users">
    				<Suspense fallback={loadingState()}>
    			    <Users/>
    				</Suspense>
          </Route>
    			<Route path="/dashboard">
    				<Suspense fallback={loadingState()}>
    			    <Dashboard/>
    				</Suspense>
          </Route>
          <Route path="/">
    	      <Home />
          </Route>
        </Switch>
    )

## Now start lazy loading your components

Great work! You've learned how to lazy load your components with `React.lazy` and then use a loading screen using `Suspense`.

Now its time to start using them. Start by identifying the components you don't need immediately after loading. This can be routes, button interactions, etc.

Finally let me know how you're using lazy-loading in your application.
