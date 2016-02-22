var ChassisDialog = document.registerElement('chassis-dialog', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
				document.body.classList.add('chassis')
				var content = '<template> <style> @charset "UTF-8"; :host { position: absolute; z-index: 1000; border: 1px solid gold; } ngn-window { position: absolute; z-index: 1000; border: 1px solid gold; } :host([draggable="true"]) { cursor: move; } ngn-window([draggable="true"]) { cursor: move; } /*:host > div:first-of-type {  } ngn-window > div:first-of-type {  }*/ </style> <div><b>Test</b><content></content></div> </template> '.replace(/<(\/?)template(.*?)>/gi,'')
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
        var me = this
        var dragel = null
        this.initTpl()

        // Make it draggable
        if (this.getAttribute('draggable') === 'true') {
          this.addEventListener('mousedown', function (e) {
            dragel = e.target
            e.preventDefault()
          })

          this.addEventListener('mouseup', function (e) {
            dragel = null
          })

          document.addEventListener('mouseleave', function () {
            dragel = null
          })

          document.addEventListener('mousemove', function (e) {
            if (dragel) {
              var w = dragel.offsetWidth / 2
              var h = dragel.offsetHeight / 2
              var r = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0) - ((w * 2) + (e.clientX - w))
              dragel.style.left = (e.clientX - w) + 'px'
              dragel.style.top = (e.clientY - h) + 'px'
              dragel.style.right = r + 'px'
              dragel.style['z-index'] = 9999999
            }
          })
        }
      }
    }

  // Expand & Collapse (collapse returns to original size)
  // Resizing
  // setPosition
  // open/close
  // animateFrom
  // Bring to front/back
  // Forward/Backward
  })
})
