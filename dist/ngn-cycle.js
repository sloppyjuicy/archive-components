var NgnCycle = document.registerElement('ngn-cycle', { // eslint-disable-line no-unused-vars
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
				document.body.classList.add('chassis')
				var content = '<template> <style> @charset "UTF-8"; div { display: flex; flex: 1 1 auto; } div > * { display: none; flex: 1 1 auto; } ::content > * { display: none; flex: 1 1 auto; } div > .active { display: flex; } ::content > .active { display: flex; } </style> <div id="host"> <content></content> </div> </template> '.replace(/<(\/?)template(.*?)>/gi,'')
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
      }
    },

    /**
     * @property selected
     * The current active section.
     * @return {HTMLElement}
     */
    selected: {
      get: function () {
        return this.querySelector('.active')
      }
    },

    /**
     * @property selectedIndex
     * The index number of the current active section.
     * @return {Number}
     */
    selectedIndex: {
      get: function () {
        var el = this.querySelector('.active')
        return Array.prototype.slice.call(el.parentNode.children).indexOf(el)
      }
    },

    /**
     * @method next
     * Display the next screen.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    next: {
      value: function (callback) {
        var curr = this.querySelector('.active')
        var next = curr ? curr.nextElementSibling : null
        curr && curr.classList.remove('active')
        if (curr && next) {
          next.classList.add('active')
        } else if (this.getAttribute('restart') === 'true') {
          // next = this.querySelector('section')
          next = this.children[0]
          next.classList.add('active')
        }
        this.dispatchEvent(new CustomEvent('change', { // eslint-disable-line no-undef
          detail: {
            previous: curr || null,
            el: next || null
          }
        }))
        callback && callback(next || null)
      }
    },

    /**
     * @method previous
     * Display the previous screen.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    previous: {
      value: function (callback) {
        var curr = this.querySelector('.active')
        var prev = curr ? curr.previousElementSibling : null
        curr && curr.classList.remove('active')
        if (curr && prev) {
          prev.classList.add('active')
        } else if (this.getAttribute('restart') === 'true') {
          // If current selection is first, display the last
          if (curr === this.children[0]) {
            prev = this.children[this.children.length - 1]
          } else {
            prev = this.children[0]
          }
          prev.classList.add('active')
        }
        this.dispatchEvent(new CustomEvent('change', { // eslint-disable-line no-undef
          detail: {
            next: curr || null,
            el: prev || null
          }
        }))
        callback && callback(prev || null)
      }
    },

    /**
     * @method show
     * Show the specified screen (1-based index, i.e. first element is 1).
     * @param {number} index
     * The index of the screen to display.
     */
    show: {
      value: function (i) {
        var curr = this.querySelector('.active')
        curr && curr.classList.remove('active')
        var next = this.children[i - 1]
        next && next.classList.add('active')
        this.dispatchEvent(new CustomEvent('change', { // eslint-disable-line no-undef
          detail: {
            previous: curr || null,
            el: next || null
          }
        }))
      }
    },

    /**
     * @method first
     * A helper method to display the first element.
     */
    first: {
      value: function (i) {
        this.show(1)
      }
    },

    /**
     * @method last
     * A helper method to display the first element.
     */
    last: {
      value: function (i) {
        this.show(this.children.length)
      }
    }
  })
})
