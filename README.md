# Chassis Web Components

The chassis- Web Components library is a collection of vanilla web components. The
library is designed to isolate common functionality and deliver it in a simple,
reusable manner.

For a list of components, see the [custom tags directory](./tree/master/tags).
You can also see these elements in action by looking at the [examples site](http://ngnjs.github.io/chassis-components/documentation).
Unfamiliar with chassis-? Head over to the [ngn.js.org](http://ngn.js.org).

## Using chassis- Web Components

The web components are available via the [JSDelivr CDN](http://www.jsdelivr.com/projects/ngn-components),
npm, or bower. You can also download them from the [releases page](./releases).

Most of the components use the [shadow DOM](http://w3c.github.io/webcomponents/spec/shadow/),
which is a major part of web components. However; Chrome & Opera are the only browsers
currently supporting it (as of 3/1/16). This also means tools like [Electron](https://electron.atom.io)
and [NW.js](http://nwjs.io) natively support shadow DOM and other web component
features. For other browsers, Google has provided a polyfill that can be used
until other browsers catch up. So, a common way to use chassis web components
across modern browsers (IE 11+) looks like:

```html
<!DOCTYPE html>
<html class="no-js">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width">
  <script src="https://cdn.jsdelivr.net/webcomponentsjs/latest/webcomponents.min.js"></script>
  <script src="//cdn.jsdelivr.net/chassis-components/latest/chassis-cycle.min.js"></script>
  <!-- <link rel="import" href="//cdn.jsdelivr.net/chassis-components/latest/chassis-cycle.min.js"/> -->
</head>

<body>
  <chassis-cycle restart="true">
    <section class="active">
      Screen 1
    </section>
    <section>
      Screen 2
    </section>
    <section>
      Screen 3
    </section>
  </chassis-cycle>
</body>

</html>
```

Each web component has it's own special documentation listed in it's [folder](./tree/master/tags).
Be sure to review these for detailed information about the specific components
you're interested in.

**Production Use**

If you're using these components in a production website, it is probably best to
use the concatenation features of JSDelivr. Select the components you wish to use
and include them in one HTTP request. Alternatively, you may find
[Chassis HTTP Preconnect](https://github.com/chassis-js/chassis-lib/blob/master/src/http.js#L631)
helpful, or use `preconnect` directly in the `<head>` of your HTML page. For
more information about preconnect, see
[Ilya Grigorik's Preconnect article](https://www.igvita.com/2015/08/17/eliminating-roundtrips-with-preconnect/).

### Bower

If you use bower to manage UI dependencies, you can install & use it as follows:

```sh
bower install chassis-components
```

In your HTML:

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/webcomponentsjs/latest/webcomponents.min.js"></script>
    <script src="bower_components/chassis-components/dist/<tag>.min.js"></script>
    <!-- <link rel="import" href="bower_components/chassis-components/dist/<tag>.html"/> -->
  </head>
  <body>
    ...
  </body>
</html>
```

### npm

The npm installation is designed for projects in a node-like environment, such
as [electron](http://electron.atom.io) or [NW.js](http://nwjs.io). Usage is
straightforward:

```sh
npm install ngn-chassis-components
```

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/webcomponentsjs/latest/webcomponents.min.js"></script>
    <script src="node_modules/ngn-chassis-components/dist/<tag>.min.js"></script>
    <!-- <link rel="import" href="node_modules/chassis-chassis-components/dist/<tag>.html"/> -->
  </head>
  <body>
    ...
  </body>
</html>
```

# Creating New Components (Hacking)

If you want to create a new chassis- web component, you should first post an issue
or reach out to the chassis- team to assure we'll accept it. We are absolutely
interested in community contributions, but we also have a strict philosophy
of keeping things simple. For example, we won't accept tags like `<my-whole-app>`,
but we will consider small, reusable tags.

When you're ready to start building a component, the easiest way is to clone
this repository using `git clone https://github.com/ngnjs/chassis-components.git`.
We use [Node.js](http://nodejs.org) for our build process, so you'll need that
installed. Then run `npm install` to install all of the dependencies. Finally,
run `gulp create` or `npm run create` to launch the new component wizard.

The new component wizard prompts for some simple input, then uses base templates
to generate starter code.

**Why should I use the wizard?**

In order to deliver components via CDN, we have our own build process that
smartly concatenates all files into a single JavaScript file. It's similar
(conceptually) to Polymer's Vulcanize utility. You can run this utility
by executing `gulp build` or `npm run build` to see the output.

The build tool generates a debuggable JS script, a minified version, and an HTML
wrapper for use with [HTML Imports](http://w3c.github.io/webcomponents/spec/imports/).
We use this process to automatically generate production-ready components and
upload them to the CDN through our automated release process.

### PAY ATTENTION TO initTpl

The wizard will generate a `tag.js` file. Within this file, you'll notice a
method/attribute called `initTpl`. This is a standard method that constructs
your component for you while you develop it. This method allows you to maintain
your template HTML/CSS and JS in different files. The build process replaces this
method with a more compact one specifically designed for production use. The simple
explanation is the HTML/CSS gets converted to text and embedded in this file, making
it simple to deploy all of the component's assets in a single file.

Most developers shouldn't really need to care about `initTpl`. As long as it
exists and is executed in the `createdCallback` method (i.e. `this.initTpl()`),
your component should just work... in development or in production.

If you have questions, create an issue and we'll do our best to help.

## License

All components are licensed as MIT unless otherwise noted.
Copyright &copy; 2016 Ecor Ventures LLC. All Rights Reserved.
