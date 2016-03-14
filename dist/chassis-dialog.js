var ChassisDialog = document.registerElement('chassis-dialog', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
				document.body.classList.add('chassis')
				var content = '<template> <style> @charset "UTF-8"; :host { position: absolute; z-index: 1000; resize: both; } chassis-dialog { position: absolute; z-index: 1000; resize: both; } :host([draggable="true"]) { cursor: move; } chassis-dialog([draggable="true"]) { cursor: move; } :host > div:first-of-type { border: 2px solid gold; } :chassis-dialog > div:first-of-type { border: 2px solid gold; } /*:host > div:first-of-type {  } ngn-window > div:first-of-type {  }*/ </style> <div><content></content></div> </template> '.replace(/<(\/?)template(.*?)>/gi,'')
				var shadow = this.createShadowRoot()
				var ph = document.createElement('p')
				ph.insertAdjacentHTML('afterbegin', content)
				Array.prototype.slice.call(ph.children).forEach(function (el) {
					shadow.appendChild(document.importNode(el, true))
				})
				delete ph
}

    },

    screenWidth: {
      enumerable: false,
      get: function () {
        return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0)
      }
    },

    screenHeight: {
      enumerable: false,
      get: function () {
        return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0)
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
              var r = me.screenWidth - ((dragel.offsetWidth) + (e.clientX - w))
              var l = (e.clientX - w)
              var t = (e.clientY - h)

              if (me.getAttribute('contain') === 'true') {
                if (r < 0) {
                  r = 0
                  l = me.screenWidth - dragel.offsetWidth
                }
                if (l < 0) {
                  l = 0
                  r = me.screenWidth - dragel.offsetWidth
                }
                if (t < 0) {
                  t = 0
                }
                if (me.screenHeight - (t + dragel.offsetHeight) < 0) {
                  t = me.screenHeight - dragel.offsetHeight
                }
              }

              dragel.style.left = l + 'px'
              dragel.style.top = t + 'px'
              dragel.style.right = r + 'px'
              dragel.style['z-index'] = 9999999
            }
          })
        }

        if (this.getAttribute('from') !== null) {
          var el = this.getAttribute('from')
          if (!(el instanceof HTMLElement)) {
            el = document.querySelector(el)
          }
          if (el instanceof HTMLElement) {
            console.log('From somewhere')
          } else {
            console.warn(el.toString() + ' could not be found or does not exist as a source for the chassis-dialog to animate from.')
          }
        }
      }
    },

    // transitionFrom: {
    //   value: function () {
    //     var clickRect = this.targetElement.getBoundingClientRect()
    //     var dialogRect = this.getBoundingClientRect()
    //
    //     var scaleX = Math.min(0.5, clickRect.width / dialogRect.width)
    //     var scaleY = Math.min(0.5, clickRect.height / dialogRect.height)
    //     var translateY = transitionFrom ?
    //       (-(window.pageYOffset + dialogRect.top) + clickRect.top + clickRect.height / 2 - dialogRect.height / 2) :
    //       (-dialogRect.top + clickRect.top + clickRect.height / 2 - dialogRect.height / 2)
    //
    //     this.style.transform = 'translate3d(' +
    //       (-dialogRect.left + clickRect.left + clickRect.width / 2 - dialogRect.width / 2) + 'px,' + translateY + 'px,' +
    //       '0) scale(' + scaleX + ',' + scaleY + ')'
    //   }
    // }

  // Expand & Collapse (collapse returns to original size)
  // Resizing
  // setPosition
  // open/close
  // animateFrom
  // Bring to front/back
  // Forward/Backward
  // center()
  })
})
