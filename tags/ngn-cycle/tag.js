var NgnCycle = document.registerElement('ngn-cycle', {
  prototype: Object.create(HTMLElement.prototype, {
    history: {
      enumerable: false,
      value: []
    },

    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'ngn-cycle'
        var src = document.querySelector('script[src*="' + tag + '"]') || document.querySelector('link[href*="' + tag + '.html"]')
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

        this.initTpl()

        this.addEventListener('change', function (e) {
          me.history.push(e.detail)
        })
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
        var curr = this.querySelector('section.active')
        var next = curr.nextElementSibling
        curr && curr.classList.remove('active')
        if (curr && next) {
          next.classList.add('active')
        } else if (this.getAttribute('restart') === 'true') {
          next = this.querySelector('section')
          next.classList.add('active')
        }
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            previous: curr || null,
            section: next || null
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
        var curr = this.querySelector('section.active')
        var prev = curr.previousElementSibling
        curr && curr.classList.remove('active')
        if (curr && prev) {
          prev.classList.add('active')
        } else if (this.getAttribute('restart') === 'true') {
          prev = this.querySelector('section:last-of-type')
          prev.classList.add('active')
        }
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            next: curr || null,
            section: curr || null
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
        var curr = this.querySelector('section.active')
        curr && curr.classList.remove('active')
        var next = this.querySelector('section:nth-of-type(' + i + ')')
        next && next.classList.add('active')
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            previous: curr || null,
            section: next || null
          }
        }))
      }
    },

    /**
     * @method back
     * Go back in the history.
     * @param {number} [index=1]
     * The number of actions to revert through.
     */
    back: {
      value: function (i) {
        i = i || 1
        var action = this.history[this.history.length - i]
        this.history.splice(this.history.length - i, this.history.length)
        action = action.previous ? action.previous : action.next
        this.querySelector('section.active').classList.remove('active')
        action.classList.add('active')
      }
    }
  })
})
