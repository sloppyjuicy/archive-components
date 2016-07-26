var ChassisListinput = document.registerElement('chassis-listinput', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLInputElement.prototype, { // eslint-disable-line no-undef

    initTpl: {
      enumerable: false,
      value: function () {
				document.body.classList.add('chassis')
				var content = '<template> <style> :host { max-width: 100%; } content { max-width: 100%; } </style> <content></content> </template> '.replace(/<(\/?)template(.*?)>/gi,'')
				var shadow = this.createShadowRoot()
				var ph = document.createElement('p')
				ph.insertAdjacentHTML('afterbegin', content)
				Array.prototype.slice.call(ph.children).forEach(function (el) {
					shadow.appendChild(document.importNode(el, true))
				})
				delete ph
}

    },

    createdCallback: {
      value: function () {
        this.initTpl()

        var me = this
        var childItems = []

        // Move all extraneous children to the list
        var extraneousElements = this.querySelectorAll(':not(ul):not(input)')
        if (extraneousElements !== null) {
          Array.prototype.slice.call(extraneousElements)
            .forEach(function (element) {
              childItems.push(element.cloneNode(true))
              me.removeChild(element)
            })
        }

        if (this.querySelector('ul') === null) {
          this.insertAdjacentHTML('afterbegin', '<ul' + (childItems.length === 0 ? 'style="display: none;"' : '') + '></ul>')
        }

        // Make sure the unordered list element is available.
        childItems.forEach(function (child) {
          me.querySelector('ul').appendChild(child)
        })

        // If it's a browsable list, add the browse button.

console.log(this.attributes)
        if (this.querySelector('input') === null) {
          this.insertAdjacentHTML('beforeend', '<input placeholder="test"></input>')
        }
      }
    }
  })
})
