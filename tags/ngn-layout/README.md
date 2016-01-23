# ngn-layout

This custom element can be used to create page layouts. It is currently a tool
for rapid prototyping. It applies very simple flexbox CSS properties to establish
a layout conforming to whatever constraints the developer desires. Each
`<ngn-layout>` tag can be thought of as a container, similar to a `<div>` or
`<section>`, but with flexbox pre-applied. It is lightweight, reusable, and
it can be styled in any manner.

There is one notable attribute called `type` (see below for details). When set
to `viewport`, the tag will consume the entire page and orient all sub-tags
accordingly. This is the most effective way of making a full screen layout
for single page apps.

## Usage

```html
<html>
  <head>
  <!-- <link rel="import" href="../../ngn-layout.html"/> -->
  <!-- <script src="../../dist/ngn-layout.min.js"></script> -->
  <!-- <script src="../../tags/ngn-layout/tag.js"></script> -->
  <script src="//cdn.jsdelivr.net/webcomponentsjs/latest/webcomponents.min.js"></script>
  <script src="//cdn.jsdelivr.net/ngn-components/latest/ngn-layout.min.js"></script>
  </head>
  <body>
    <ngn-layout></ngn-layout>
  </body>
</html>
```

## Example

```html
<style>
  #three {
    max-width: 200px;
  }
  ngn-layout {
    border: 1px solid rgba(0,0,0,.5)
  }
</style>
<ngn-layout type="viewport">
  <ngn-layout>
    Column 1
  </ngn-layout>
  <ngn-layout>
    Column 2
  </ngn-layout>
  <ngn-layout type="vertical" id="three">
    Testing 2
    <ngn-layout>
      SubSection A
    </ngn-layout>
    <ngn-layout type="horizontal">
      <ngn-layout>
        SubSection B
      </ngn-layout>
      <ngn-layout>
        SubSection C
      </ngn-layout>
    </ngn-layout>
  </ngn-layout>
</ngn-layout>
```

The code above creates a simple modular layout.

## Attributes

### type

There are three values that can be applied to this:

- **horizontal**: All content within a horizontal
  layout will be shown side by side in a row-like fashion.  
- **vertical**: This is the default setting. All content within a vertical
  layout will be shown stacked on top of each other in a column-like manner.
- **viewport**: This is a special type that will expand to use the maximum
  amount of space. For example, setting the first layout to be viewport will
  consume the entire page (as is shown in the example above).
