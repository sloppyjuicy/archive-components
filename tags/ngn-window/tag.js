var NgnWindow = document.registerElement('ngn-window', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'ngn-window'
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
        var dragging = false
        this.initTpl()

      // if (this.getAttribute('draggable') === 'true') {
      //   this.addEventListener('mousedown', function (e) {
      //     dragging = true
      //     e.preventDefault()
      //   })
      //   this.addEventListener('mouseup', function (e) {
      //     // e.preventDefault()
      //     dragging = false
      //   })
      //   document.addEventListener('mousemove', function (e) {
      //     console.log(dragging)
      //     if (dragging) {
      //       var width = e.target.offsetWidth / 2
      //       var height = e.target.offsetHeight / 2
      //       var x = e.clientX - width
      //       var y = e.clientY - height
      //       e.target.setAttribute('style', 'left: ' + x + 'px; top: ' + y + 'px;z-index: 9999;')
      //     }
      //   })
      // }
      }
    }
  })
})
