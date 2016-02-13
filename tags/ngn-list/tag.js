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

    // Applies event handlers to support selection.
    applyHandlers: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (el, scope) {
        scope = scope || this

        // Listen for click
        el.addEventListener('click', function (e) {
          // If ctrl or shift is not held during click, don't aggregate selections
          if (!(e.ctrlKey || e.altKey || scope.cmdKeyPressed || e.shiftKey)) {
            scope.slice(scope.children).forEach(function (child) {
              if (child !== el) {
                child.hasAttribute('selected') && child.removeAttribute('selected')
              }
            })
          } else {
            // If ctrl or shift is held but there is no last selection, things are empty.
            if (scope._lastSelection !== null) {
              if (e.shiftKey) {
                var prev = scope.indexOfParent(scope._lastSelection) // Previous selection
                var curr = scope.indexOfParent(el) // Current selction
                var dir = prev >= curr // Direction
                while (prev !== curr) {
                  if (scope.children[prev].getAttribute('filter') !== 'true') {
                    if (!(e.target.getAttribute('selected') === 'true')) {
                      scope.children[prev].setAttribute('selected', 'true')
                    } else {
                      scope.children[prev].removeAttribute('selected')
                    }
                  }
                  dir && prev--
                  !dir && prev++
                }
              } else if (!e.ctrlKey && !e.altKey && !scope.cmdKeyPressed) {
                if (scope.querySelectorAll('[selected="true"]:not([filter="true"])').length > 1) {
                  scope.slice(scope.querySelectorAll('[selected="true"]:not([filter="true"])')).forEach(function (r) {
                    if (r !== el) {
                      r.removeAttribute('selected')
                    }
                  })
                }
              }
            }
          }
          if (el.getAttribute('selected') === 'true') {
            el.removeAttribute('selected')
          } else {
            el.setAttribute('selected', 'true')
          }
          scope._lastSelection = el
        })
      }
    },

    createdCallback: {
      value: function () {
        var me = this

        Object.defineProperties(this, {
          _lastSelection: {
            enumerable: false,
            writable: true,
            configurable: false,
            value: null
          },
          cmdKeyPressed: {
            enumerable: false,
            writable: true,
            configurable: false,
            value: false
          }
        })

        if (this.children.length > 0) {
          this._lastSelection = this.children[0]
        }

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

        // Add support for CMD key on OSX
        window.addEventListener('keydown', function (e) {
          if (e.keyCode === 91) {
            me.cmdKeyPressed = true
          }
        })
        window.addEventListener('keyup', function (e) {
          if (e.keyCode === 91) {
            me.cmdKeyPressed = false
          }
        })
      }
    },

    /**
     * @method selectAll
     * Select every item in the list. This will not select any item
     * which is filtered out, unless `force=true`
     * @param {Boolean} [force=false]
     * Set this to `true` to select everything, even if a filter
     * is applied.
     */
    selectAll: {
      value: function (force) {
        force = typeof force === 'boolean' ? force : false
        this.slice(this.children).forEach(function (el) {
          if (!force || el.getAttribute('filtered') === null) {
            el.setAttribute('selected', true)
          }
        })
      }
    },

    /**
     * @method clearSelected
     * Clears all selections. If a hidden/filtered element is
     * selected, it will be deselected too.
     */
    clearSelected: {
      value: function () {
        this.slice(this.children).forEach(function (el) {
          el.removeAttribute('selected')
        })
      }
    },

    /**
     * @method invertSelected
     * Deselects any selected item and vice versa. This is
     * a way to completely reverse the selection.
     */
    invertSelection: {
      value: function () {
        this.slice(this.children).forEach(function (el) {
          if (el.getAttribute('selected') !== 'true') {
            el.setAttribute('selected', 'true')
          } else {
            el.removeAttribute('selected')
          }
        })
      }
    },

    /**
     * @method next
     * Applies the same state to the next item in the list.
     * For example, if the last action was to select an item,
     * the next item on the list will be selected. If the last
     * action was to deselect an item, the next item will be
     * deselected. This only applies to items that are not filtered.
     */
    next: {
      value: function () {
        var next = this._lastSelection.nextSibling
        while (next !== null && (next.nodeType === 3 || next.getAttribute('filter') === 'true')) {
          next = next.nextSibling
        }
        if (next === null) {
          return
        }
        if (this._lastSelection.getAttribute('selected') === 'true') {
          next.setAttribute('selected', 'true')
        } else {
          next.removeAttribute('selected')
        }
        this._lastSelection = next
      }
    },

    /**
     * @method previous
     * Applies the same state to the previous item in the list.
     * For example, if the last action was to select an item,
     * the previous item on the list will be selected. If the last
     * action was to deselect an item, the previous item will be
     * deselected. This only applies to items that are not filtered.
     */
    previous: {
      value: function () {
        var prev = this._lastSelection.previousSibling
        while (prev !== null && (prev.nodeType === 3 || prev.getAttribute('filter') === 'true')) {
          prev = prev.previousSibling
        }
        if (prev === null) {
          return
        }
        if (this._lastSelection.getAttribute('selected') === 'true') {
          prev.setAttribute('selected', 'true')
        } else {
          prev.removeAttribute('selected')
        }
        this._lastSelection = prev
      }
    },

    /**
     * @method filter
     * Add a `filter="true"` attribute to each list item which
     * matches the filter criteria.
     * @param {function} filter (required)
     * This method receives 3 arguments: `HTMLElement`, `index`, and
     * `Array`. Each element is a list item. The index refers to
     * the item's position in the list (0-based, like an array), and
     * the array contains a reference to the entire list.
     * @example
     * **Original HTML**
     * ```html
     * <ngn-list>
     *   <section>A1</section>
     *   <section>B2</section>
     *   <section>C2</section>
     * </ngn-list>
     * ```
     *
     * **Apply a filter...**
     * ```js
     * var li = document.querySelector('ngn-list')
     * li.filter(function (element, index, listarray) {
     *   return element.textContent.substr(1, 1) === '1'
     * })
     * ```
     *
     * **Resulting HTML**
     * ```html
     * <ngn-list>
     *   <section filter="true">A1</section>
     *   <section >B2</section>
     *   <section>C2</section>
     * </ngn-list>
     * ```
     * @fires item.filter
     * Fired when an item matches the filter criteria.
     */
    filter: {
      value: function (fn) {
        var me = this
        if (!(typeof fn === 'function')) {
          console.warn('[ngn-list].filter(myFunction) method requires a function, but none was provided.')
          fn = function () { return false }
        }
        this.slice(this.children).filter(fn).forEach(function (el) {
          el.setAttribute('filter', 'true')
          me.dispatchEvent(new CustomEvent('item.filter', {
            detail: {
              item: el
            }
          }))
        })
      }
    },

    /**
     * @method clearFilter
     * Clear all filters.
     * @fires item.unfilter
     * Fired when a previously filtered item is no longer filtered.
     */
    clearFilter: {
      value: function () {
        var me = this
        this.slice(this.children).forEach(function (el) {
          el.removeAttribute('filter')
          me.dispatchEvent(new CustomEvent('item.unfilter', {
            detail: {
              item: el
            }
          }))
        })
      }
    },

    /**
     * @method sort
     *
     */
    sort: {
      value: function (fn) {}
    }
  })
})
