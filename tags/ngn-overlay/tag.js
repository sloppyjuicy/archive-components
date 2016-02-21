var NgnOverlay = document.registerElement('ngn-overlay', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'ngn-overlay'
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

        var me = this

        // If close on dblclick isn't false, close the overlay when it is double clicked.
        /**
         * @attribute {boolean} [closeOnClick=false]
         * When this is `true`, the overlay will close when the user clicks on it.
         */
        if (this.getAttribute('closeondblclick') === 'true') {
          this.addEventListener('dblclick', function (e) {
            e.preventDefault()
            if (e.target === this) {
              me.close()
            }
          })
        } else if (this.getAttribute('closeonclick') === 'true') {
          /**
           * @attribute {boolean} [closeOnDblClick=false]
           * When this is `true`, the overlay will close when the user double
           * clicks on it.
           */
          // If close on click isn't false, close the overlay when it is clicked.
          this.addEventListener('click', function (e) {
            e.preventDefault()
            if (e.target === this) {
              me.close()
            }
          })
        }
      }
    },

    handleEscPress: {
      enumerable: false,
      value: function (e) {
        if (e.keyCode === 27) {
          this.close()
        }
      }
    },

    close: {
      value: function () {
        var me = this
        window.removeEventListener('keydown', function (e) {
          me.handleEscPress(e)
        })
        this.removeAttribute('active')
      }
    },

    open: {
      value: function () {
        /**
         * @attribute {boolean} [closeOnEsc=true]
         * When this is `true`, the overlay will close when the user
         * presses the `esc` key.
         */
        if (this.getAttribute('closeonesc') !== 'false') {
          var me = this
          window.addEventListener('keydown', function (e) {
            me.handleEscPress(e)
          })
        }
        this.setAttribute('active', 'true')
      }
    }
  })
})
