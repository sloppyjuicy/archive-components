/**
 * @tag ngn-list
 * Provides functionality for a list of elements.
 * @fires item.create
 * Fired when an item is added to the list. The item which is
 * created is returned to the event handler.
 * @fires item.delete
 * Fired when an item is removed from the list. The item which is
 * removed is returned to the event handler.
 */
var NgnList = document.registerElement('ngn-list', { // eslint-disable-line no-undef, no-unused-vars
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'ngn-list'
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

    slice: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (o) {
        return Array.prototype.slice.call(o)
      }
    },

    indexOfParent: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (el) {
        return this.slice(el.parentNode.children).indexOf(el)
      }
    },

    applyHandlers: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (el, scope) {
        scope = scope || this

        // Listen for click
        el.addEventListener('click', function (e) {
          // If ctrl or shift is not held during click, don't aggregate selections
          if (!(e.ctrlKey || e.shiftKey)) {
            scope.slice(scope.children).forEach(function (child) {
              if (child !== el) {
                child.hasAttribute('selected') && child.removeAttribute('selected')
              }
            })
          } else {
            // If ctrl or shift is held but there is no last selection, things are empty.
            if (scope._lastSelection !== null) {
              if (e.shiftKey) {
                console.log('key')
                var prev = scope.indexOfParent(scope._lastSelection) // Previous selection
                var curr = scope.indexOfParent(el) // Current selction
                var dir = prev >= curr // Direction
                while (prev !== curr) {
                  if (el.hasAttribute('selected')) {
                    scope.children[prev].setAttribute('selected', true)
                  } else {
                    scope.children[prev].removeAttribute('selected')
                  }
                  dir && prev--
                  !dir && prev++
                }
              } else if (!e.ctrlKey) {
                if (scope.querySelectorAll('[selected]').length > 1) {
                  scope.slice(scope.querySelectorAll('[selected]')).forEach(function (r) {
                    if (r !== el) {
                      r.removeAttribute('selected')
                    }
                  })
                }
              }
            }
          }
          if (el.hasAttribute('selected')) {
            el.removeAttribute('selected')
          } else {
            el.setAttribute('selected', true)
          }
          scope._lastSelection = el
        })
      }
    },

    createdCallback: {
      value: function () {
        var me = this

        Object.defineProperty(this, '_lastSelection', {
          enumerable: false,
          writable: true,
          configurable: false,
          value: null
        })

        // this.initTpl()

        // Apply event handlers to top level elements in the list
        this.slice(this.children).forEach(function (el) {
          me.applyHandlers(el, me)
        })

        var observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
              if (mutation.addedNodes.length > 0) {
                me.slice(mutation.addedNodes).forEach(function (el) {
                  me.dispatchEvent(new CustomEvent('item.create', { // eslint-disable-line no-undef
                    detail: {
                      item: el
                    }
                  }))
                })
              } else if (mutation.removedNodes.length > 0) {
                me.slice(mutation.removedNodes).forEach(function (el) {
                  me.dispatchEvent(new CustomEvent('item.delete', { // eslint-disable-line no-undef
                    detail: {
                      item: el
                    }
                  }))
                })
              }
            }
          })
        })

        observer.observe(this, {
          childList: true
        })
      }
    }
  })
})
