var NgnLayout = document.registerElement('ngn-layout', {
  prototype: Object.create(HTMLElement.prototype, {
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'ngn-layout'
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
      }
    }
  })
})
