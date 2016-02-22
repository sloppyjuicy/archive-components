var NgnOverlay = document.registerElement('ngn-overlay', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
				document.body.classList.add('chassis')
				var content = '<template> <style> @charset "UTF-8"; :host { background: rgba(0,0,0,.6); display: flex; position: fixed; top: 0; right: 0; bottom: 0; left: 0; margin: 0; padding: 0; align-items: center; justify-content: center; opacity: 0; pointer-events: none; } ngn-overlay { background: rgba(0,0,0,.6); display: flex; position: fixed; top: 0; right: 0; bottom: 0; left: 0; margin: 0; padding: 0; align-items: center; justify-content: center; opacity: 0; pointer-events: none; } :host([active="true"]) { opacity: 1; pointer-events: auto; } ngn-overlay[active="true"] { opacity: 1; pointer-events: auto; } </style> <!-- <ngncontent id="host" class="active"> --> <content></content> <!-- </ngncontent> --> </template> '.replace(/<(\/?)template(.*?)>/gi,'')
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
        document.body.style.overflow = 'initial'
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
        document.body.style.overflow = 'hidden'
        this.setAttribute('active', 'true')
      }
    }
  })
})
