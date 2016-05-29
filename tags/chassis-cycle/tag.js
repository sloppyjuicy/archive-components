var NgnCycle = document.registerElement('chassis-cycle', { // eslint-disable-line no-unused-vars
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'chassis-cycle'
        var src = document.querySelector('script[src*="' + tag + '"]') || document.querySelector('link[href*="' + tag + '.html"]')

        document.body.classList.add('chassis')

        if (src) {
          src = (src.hasAttribute('src') ? src.getAttribute('src') : src.getAttribute('href')).replace(/\\/g, '/')
          src = src.split('/')
          src.pop()
          src = src.join('/') + '/template.html'
          var req = new XMLHttpRequest()
          var me = this
          req.addEventListener('load', function () {
            var content = this.responseText.replace(/\n|\s+/g, ' ').replace(/\s\s/g, ' ').replace(/<(\/?)template(.*?)>/gi, '')
            var shadow = me.createShadowRoot()
            var ph = document.createElement('p')
            ph.insertAdjacentHTML('afterbegin', content)
            Array.prototype.slice.call(ph.children).forEach(function (el) {
              shadow.appendChild(document.importNode(el, true))
            })
          })
          req.open('GET', src)
          req.send()
        } else {
          this.createShadowRoot()
        }
      }
    },

    createdCallback: {
      value: function () {
        this.initTpl()

        // Identify active element
        Object.defineProperty(this, 'active', {
          enumerable: false,
          writable: true,
          configurable: false,
          value: 0
        })

        // Forcibly hide non-active elements
        for (var i=0; i < this.children.length; i++) {
          if (['', 'true'].indexOf(this.children[i].getAttribute('selected')) >= 0) {
            // Active
            this.active = i
            if (/none/gi.test(this.children[i].style.display)) {
              this.children[i].style.display = ''
            }
          } else {
            // Inactive
            var style = this.children[i].getAttribute('style') || ''
            style = style + "display: none !important;"
            this.children[i].setAttribute('style', style)
          }
        }
      }
    },

    /**
     * @property selected
     * The current active section.
     * @return {HTMLElement}
     */
    selected: {
      get: function () {
        return this.querySelector('[selected]:not([selected="false"])')
      }
    },

    /**
     * @property selectedIndex
     * The index number of the current active section.
     * @return {Number}
     */
    selectedIndex: {
      get: function () {
        var el = this.querySelector('[selected]:not([selected="false"])')
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
        var curr = this.selected
        var next = curr ? curr.nextElementSibling : null
        if (curr) {
          this.hide(curr)
        }
        if (curr && next) {
          this.show(next)
        } else if (this.getAttribute('restart') === 'true') {
          next = this.children[0]
          this.show(next)
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
        var curr = this.selected
        var prev = curr ? curr.previousElementSibling : null
        if (curr) {
          this.hide(curr)
        }
        if (curr && prev) {
          this.show(prev)
        } else if (this.getAttribute('restart') === 'true') {
          // If current selection is first, display the last
          if (curr === this.children[0]) {
            prev = this.children[this.children.length - 1]
          } else {
            prev = this.children[0]
          }
          this.show(prev)
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

    hide: {
      enumerable: false,
      value: function (el) {
        if (el.hasAttribute('selected')) {
          el.removeAttribute('selected')
        }
        el.setAttribute('style', el.style.display.replace(el.style.display, 'display: none !important;'))
      }
    },

    hideActive: {
      enumerable: false,
      value: function () {
        this.hide(this.selected)
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
        var next
        switch ((typeof i).toLowerCase()) {
          case 'number':
            next = this.children[i - 1]
            break
          case 'string':
            next = this.querySelector(i)
            break
          default:
            next = i
        }
        var curr = this.selected
        if (curr) {
          this.hideActive()
        }
        if (next) {
          next.setAttribute('selected', 'true')
          next.setAttribute('style', next.style.display.replace(next.style.display, ''))
        }
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
