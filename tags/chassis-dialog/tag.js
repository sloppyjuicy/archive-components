var ChassisDialog = document.registerElement('chassis-dialog', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'chassis-dialog'
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
