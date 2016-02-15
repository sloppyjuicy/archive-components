# ngn-list

The `<ngn-list>` custom element manages the state of elements within it, treating them as items of a list. This provides behavior management features,
but does not explicitly force a UI.

### Behavioral Management Capabilities:

- Item selection by mouse (click events) and keyboard.
- Support for multi-selection (mouse our keyboard).
- Filtering.
- Sorting.
- Events.
- `ctrl+a` and `cmd+a` will select all.
- `ctrl+click`, `cmd+click`, `alt+click` will toggle specific item selections without affecting any previously selected items.
- `shift+click`: Select a range.
- Arrow `shift+` `up`, `down`, `left`, or `right` to toggle selections sequentially.


### General Concepts

This component primarily manages two attributes on any element within the list.

The `selected` attribute is used to indicate an item is selected. The component
manages this attribute, emitting events whenever it makes a change.

The `filter` attribute is used to indicate an item is filtered. The component
manages this attribute, emitting events whenever it makes a change.

### Styling

This component does not invoke any type of styling. It is only concerned with
maintaining the attributes of list items. The developer is responsible for
managing the visual presentation of the component. For example, to visually
highlight selected items, the CSS should highlight elements with the selected attribute:

```css
ngn-list [selected="true"] {
  background-color: #336699;
  color: #ffffff
}
```

Likewise, visually removing filtered items is also accomplished via CSS:

```css
ngn-list [filter="true"] {
  display: none;
}
```

See the example, which contains CSS for styling based on filter and selection criteria.

## Usage

```html
<html>
  <head>
  <!-- <link rel="import" href="../../ngn-list.html"/> -->
  <!-- <script src="../../dist/ngn-list.min.js"></script> -->
  <!-- <script src="../../tags/ngn-list/tag.js"></script> -->
  <script src="//cdn.jsdelivr.net/webcomponentsjs/latest/webcomponents.min.js"></script>
  <script src="//cdn.jsdelivr.net/ngn-components/latest/ngn-list.min.js"></script>
  </head>
  <body>
    <ngn-list>...</ngn-list>
  </body>
</html>
```

## Example

```html
<ngn-list>
  <section>A4</section>
  <section>B4</section>
  <section>C4</section>
  <div>D4</div>
  <section>E3</section>
  <section>F3</section>
  <p>G3</p>
  <section>H2</section>
  <section>I2</section>
  <section>J1</section>
</ngn-list>

<script type="text/javascript">
  var list = document.querySelector('ngn-list')

  list.addEventListener('item.create', function (e) {
    console.info('Created', e.detail.item)
  })
  list.addEventListener('item.delete', function (e) {
    console.warn('Deleted', e.detail.item)
  })

  setTimeout(function () {
    list.insertAdjacentHTML('beforeend', '<section>z</section>')
    setTimeout(function () {
      list.removeChild(list.children[list.children.length - 1])
    }, 1500)
  }, 500)
</script>
```

This example outputs a note to the console whenever a new item is added or removed.

## Attributes

Currently, there is only one recognized attribute, `rollover`.

### rollover

Setting `<ngn-list rollover="true">...</ngn-list>` will make arrow key functions
automatically roll over. For example, if the last item on the list is currently
selected and the user presses the next arrow (right or down), the selection
process rolls over to the first element. Likewise, if the first list item is selected
and the user presses the prior arrow (left or up), it will automatically select
the last item in the list.
