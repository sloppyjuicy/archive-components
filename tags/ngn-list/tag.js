/**
 * @tag ngn-list
 * Provides functionality for a list of elements.
 * @fires item.create
 * Fired when an item is added to the list. The item which is
 * created is returned to the event handler.
 * @fires item.delete
 * Fired when an item is removed from the list. The item which is
 * removed is returned to the event handler.
 * @fires item.select
 * Fired when an item is selected from the list. The item which is
 * selected is returned to the event handler.
 * @fires item.unselect
 * Fired when a previously selected item is unselected. The item which is
 * unselected is returned to the event handler.
 * @fires item.filter
 * Fired when an item is filtered from the list. The item which is
 * filtered is returned to the event handler.
 * @fires item.unfilter
 * Fired when a previously filtered item is unselected. The item which is
 * unfiltered is returned to the event handler.
 */
var NgnList = document.registerElement('ngn-list', { // eslint-disable-line no-undef, no-unused-vars
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
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

    getItemAt: {
      enumerable: false,
      value: function (i) {
        return this.slice(this.children)[i] || null
      }
    },

    isSelected: {
      enumerable: false,
      value: function (el) {
        return el.getAttribute('selected') === 'true'
      }
    },

    isFiltered: {
      enumerable: false,
      value: function (el) {
        return el.getAttribute('filter') === 'true'
      }
    },

    toggleSelection: {
      enumerable: false,
      value: function (el) {
        if (this.isSelected(el)) {
          el.removeAttribute('selected')
          this.dispatchEvent(new CustomEvent('item.unselect', {
            detail: {
              item: el
            }
          }))
        } else {
          el.setAttribute('selected', 'true')
          this.dispatchEvent(new CustomEvent('item.select', {
            detail: {
              item: el
            }
          }))
        }
      }
    },

    toggleFilter: {
      enumerable: false,
      value: function (el) {
        if (this.isFiltered(el)) {
          el.removeAttribute('filter')
          this.dispatchEvent(new CustomEvent('item.unfilter', {
            detail: {
              item: el
            }
          }))
        } else {
          el.setAttribute('filter', 'true')
          this.dispatchEvent(new CustomEvent('item.filter', {
            detail: {
              item: el
            }
          }))
        }
      }
    },

    filterItem: {
      value: function (el) {
        if (!this.isFiltered(el)) {
          this.toggleFilter(el)
        }
      }
    },

    unfilterItem: {
      value: function (el) {
        if (this.isFiltered(el)) {
          this.toggleFilter(el)
        }
      }
    },

    selectItem: {
      value: function (el) {
        if (!this.isSelected(el)) {
          this.toggleSelection(el)
        }
      }
    },

    unselectItem: {
      value: function (el) {
        if (this.isSelected(el)) {
          this.toggleSelection(el)
        }
      }
    },

    /**
     * @method toggleRangeSelection
     * Toggle the selection of items (by index). If you want to
     * force a range to be selected or unselected regardless of the items'
     * current state, use #selectRange or #unselectRange instead.
     * @param {number} from
     * The starting item index.
     * @param {number} to
     * The ending item index.
     */
    toggleRangeSelection: {
      enumerable: true,
      value: function (from, to) {
        var start = from < to ? from : to
        var end = from > to ? from : to
        for (var i = start; i <= end; i++) {
          this.toggleSelection(this.children[i])
        }
      }
    },

    selectRange: {
      value: function (from, to) {
        var start = from < to ? from : to
        var end = from > to ? from : to
        for (var i = start; i <= end; i++) {
          this.selectItem(this.children[i])
        }
      }
    },

    unselectRange: {
      value: function (from, to) {
        var start = from < to ? from : to
        var end = from > to ? from : to
        for (var i = start; i <= end; i++) {
          this.unselectItem(this.children[i])
        }
      }
    },

    nextItem: {
      enumerable: false,
      value: function (el) {
        var next = el.nextSibling
        while (next !== null && (next.nodeType === 3 || this.isFiltered(next))) {
          next = next.nextSibling
        }
        return next
      }
    },

    previousItem: {
      enumerable: false,
      value: function (el) {
        var prev = el.previousSibling
        while (prev !== null && (prev.nodeType === 3 || this.isFiltered(prev))) {
          prev = prev.previousSibling
        }
        return prev
      }
    },

    // Applies event handlers to support selection.
    applyHandlers: {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function (el, scope) {
        var me = scope || this

        // Listen for click
        el.addEventListener('click', function (e) {
          // If no command buttons are pressed, clear everything except the clicked item.
          if (!me.holdingShift && !e.ctrlKey && !me.cmdKeyPressed && !e.altKey) {
            me.clearSelected()
            me.toggleSelection(el)
            me.base = el
            me.last = el
            return
          }

          if (e.ctrlKey || e.altKey || me.cmdKeyPressed) {
            if (me.holdingShift) {
              me.toggleSelection(me.last)
              me.toggleRangeSelection(me.indexOfParent(me.last), me.indexOfParent(el))
              me.base && me.toggleSelection(me.base)
            } else {
              me.toggleSelection(el)
            }
            me.last = el
            return
          }

          // If the shift button is pressed, selections should accrue.
          if (me.holdingShift) {
            me.base = me.base || me.last || el
            !(e.ctrlKey || e.altKey || me.cmdKeyPressed) && me.clearSelected()
            me.toggleRangeSelection(me.indexOfParent(me.base), me.indexOfParent(el))
          }
          me.last = el
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
     * @param {boolean} [aggregateSelection=false]
     * Set this to `true` to aggregate selections (i.e. don't
     * unselect prior selections).
     */
    next: {
      value: function (aggregate) {
        // if (this.last === null) {
        //   return false
        // }
        // aggregate = typeof aggregate === 'boolean' ? aggregate : this.holdingShift
        // var next = this.last.nextSibling
        // while (next !== null && (next.nodeType === 3 || next.getAttribute('filter') === 'true')) {
        //   next = next.nextSibling
        // }
        // if (next === null) {
        //   return
        // }
        //
        // try {document.querySelector('.focus').classList.toggle('focus')} catch (er) {}
        // next.classList.toggle('focus')
        // if (!aggregate) {
        //   console.log('not aggregating')
        //   this.clearSelected()
        //   next.setAttribute('selected', 'true')
        //   this.last = next
        //   return
        // }
        // this.toggleSelection(next)
        // this.last = next
      }
    },

    /**
     * @method previous
     * Applies the same state to the previous item in the list.
     * For example, if the last action was to select an item,
     * the previous item on the list will be selected. If the last
     * action was to deselect an item, the previous item will be
     * deselected. This only applies to items that are not filtered.
     * @param {boolean} [aggregateSelection=false]
     * Set this to `true` to aggregate selections (i.e. don't
     * unselect prior selections).
     */
    previous: {
      value: function (aggregate) {
        // if (this.last === null) {
        //   return false
        // }
        // aggregate = typeof aggregate === 'boolean' ? aggregate : this.holdingShift
        // var prev = this.last.previousSibling
        // while (prev !== null && (prev.nodeType === 3 || prev.getAttribute('filter') === 'true')) {
        //   prev = prev.previousSibling
        // }
        // if (prev === null) {
        //   return
        // }
        // try {document.querySelector('.focus').classList.toggle('focus')} catch (er) {}
        // prev.classList.toggle('focus')
        // if (!aggregate) {
        //   console.log('not aggregating')
        //   this.clearSelected()
        //   prev.setAttribute('selected', 'true')
        //   this.last = prev
        //   return
        // }
        // this.toggleSelection(prev)
        // this.last = prev
      }
    },

    createdCallback: {
      value: function () {
        var me = this

        Object.defineProperties(this, {
          cmdKeyPressed: {
            enumerable: false,
            writable: true,
            configurable: false,
            value: false
          },
          holdingShift: {
            enumerable: false,
            writable: true,
            configurable: false,
            value: false
          },
          base: {
            enumerable: false,
            writable: true,
            configurable: false,
            value: null
          },
          last: {
            enumerable: false,
            writable: true,
            configurable: false,
            value: null
          }
        })

        // Add support for CMD key on OSX
        window.addEventListener('keydown', function (e) {
          // CMD on OSX
          if (e.keyCode === 91) {
            me.cmdKeyPressed = true
          }
          // Arrows
          if (e.keyCode >= 37 && e.keyCode <= 40 && me._lastSelection !== null) {
            if (e.keyCode >= 39) {
              me.next(e.shiftKey || e.ctrlKey || e.altKey || me.cmdKeyPressed)
            } else {
              me.previous(e.shiftKey || e.ctrlKey || e.altKey || me.cmdKeyPresse)
            }
          }
          // Shift
          if (e.keyCode === 16) {
            me.holdingShift = true
          }
        })

        window.addEventListener('keyup', function (e) {
          // CMD on OSX
          if (e.keyCode === 91) {
            me.cmdKeyPressed = false
          } // Shift
          if (e.keyCode === 16) {
            me.holdingShift = false
            me.base = null
          }
        })

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
    },

    // getSelectedItems
    // getFilteredItems
    // getUnselectedItems
    // getCurrentItems

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
        var me = this
        this.slice(this.children).forEach(function (el) {
          // console.log('force', !force, 'filtered', el.getAttribute('filtered') === null)
          if (force || !me.isFiltered(el)) {
            me.selectItem(el)
            this.last = el
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
        var me = this
        this.slice(this.children).forEach(function (el) {
          me.unselectItem(el)
        })
        for (var i = 0; i < this.children.length; i++) {
          if (!this.isFiltered(this.children[i])) {
            this.last = this.children[i]
            break
          }
        }
      }
    },

    /**
     * @method invertSelected
     * Deselects any selected item and vice versa. This is
     * a way to completely reverse the selection. Filtered
     * items are ignored.
     */
    invertSelection: {
      value: function () {
        var me = this
        this.slice(this.children).filter(function (el) {
          console.log('Filtered?', me.isFiltered(el), el.textContent)
          return !me.isFiltered(el)
        }).forEach(function (el) {
          me.toggleSelection(el)
          me.last = el
        })
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
        if (!(typeof fn === 'function')) {
          console.warn('[ngn-list].filter(myFunction) method requires a function, but none was provided.')
          fn = function () { return false }
        }

        var me = this
        this.slice(this.children).filter(fn).forEach(function (el) {
          me.filterItem(el)
        })

        // Find the last selection (or set a sane one)
        var old_last_selection = this.last
        while (this.isFiltered(this.last)) {
          this.last = this.previousItem(this.last)
        }
        if (this.last === null) {
          this.last = old_last_selection
          while (this.isFiltered(this.last)) {
            this.last = this.nextItem(this.last)
          }
        }
        if (this.last === null) {
          this.last = this.querySelector(':not([filter="true"])')
        }
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
          me.unfilterItem(el)
        })
      }
    },

    /**
     * @method sort
     * Sort the list using a method to determin the order.
     * @param {function} sortBy (required)
     * A method of sorting. This adheres to the `Array.prototype.sort`
     * standard. For example:
     *
     * ```js
     * myList.sort(function(a, b) {
     *   // The values are DOM elements, so it may be necessary to
     *   // derive data.
     *   a = a.textContent // Get the text between the tags
     *   b = b.textContent
     *
     *   // If the values are equal, no change.
     *   if (a === b) {
     *   	 return 0
     *   }
     *
     *   // If the first value is greater than the next, return
     *   // a higher index for `a`. Otherwise return a lower index
     *   // for `a`.
     *   if (a > b) {
     *     return 1
     *   } else {
     *     return -1
     *   }
     * })
     * ```
     */
    sort: {
      value: function (fn) {
        fn = typeof fn === 'function' ? fn : function () {}
        var newhtml = ''
        this.slice(this.children).sort(fn).forEach(function (el) {
          newhtml += el.outerHTML
        })
        this.innerHTML = newhtml
      }
    }
  })
})
