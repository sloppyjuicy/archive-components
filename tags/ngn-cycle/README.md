# chassis-cycle

This custom element will display one HTML element at a time. Useful for wizards,
scrollers, tab navigation, or anything else that needs to display one
thing at a time.

### Example

```html
<button id="prev">Previous</button>
<button id="next">Next</button>
<select id="picker">
  <option value="1">Slide 1</option>
  <option value="2">Slide 2</option>
  <option value="3">Slide 3</option>
</select>
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
<script type="text/javascript">
  var cycle = document.querySelector('chassis-cycle')

  cycle.addEventListener('change', function (e) {
    console.log(e.detail)
  })

  document.querySelector('#next').addEventListener('click', function (e) {
    e.preventDefault()
    cycle.next()
  })

  document.querySelector('#prev').addEventListener('click', function (e) {
    e.preventDefault()
    cycle.previous()
  })

  document.querySelector('select').addEventListener('change', function (e) {
    cycle.show(e.target.selectedOptions[0].value)
  })
</script>
```

## Attributes

### restart

A boolean attribute that defaults to `false`. Setting this to `true` will force
the cycle to restart when it reaches the end. For example, assume a cycle with 3
sections. If the last section is shown and the `next` section is requested,
the cycle will display the first section. Likewise, if the first section is
active and the `previous` section is requested, it will show the last section.

## Methods

### next()

Use this to show the next section.

### previous()

Use this to show the previous section.

### show(n)

Use this to show a specific section by it's index. This is a 1-based index,
so the first section is `1`, the second section is `2`, etc.

### first()

Show the first section.

### last()

Show the last section.

## Events

This tag fires custom events:

### change

This event is fired when the visible section changes. It sends the following
payload to the event handler:

```js
{
  detail: {
    previous: <HTMLElement>, // Only for show() and next()
    next: <HTMLElement>, // Only for previous()
    el: <HTMLElement> // The newly selected element.
  }
}
```
