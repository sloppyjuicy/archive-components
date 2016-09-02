'use strict'

window.chassis = {
  listinput: function (element) {
    Object.defineProperties(element.__proto__, {
      listData: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: []
      },

      separator: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: element.attributes.hasOwnProperty('separator') ? element.getAttribute('separator') : ','
      },

      deduplicate: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: element.attributes.hasOwnProperty('deduplicate') ? element.getAttribute('deduplicate') === 'true' : true
      },

      deduplicateInput: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: element.attributes.hasOwnProperty('deduplicateInput') ? element.getAttribute('deduplicateInput') === 'true' :
          (element.attributes.hasOwnProperty('deduplicate') ? element.getAttribute('deduplicate') === 'true' : true)
      }
    })

    if (element.attributes.hasOwnProperty('for')) {
      var list = document.querySelector('#' + element.getAttribute('for'))

      if (list === null) {
        throw new Error('The specified DOM element, ' + element.getAttribute('for') + ', could not be found or does not exist.')
      } else {
        var listWatcher = new MutationObserver(function (mutations) {
          for (var m in mutations) {
            if (mutations[m].type === 'childList') {
              // if (mutations[m].addedNode)
              detail = mutations[m]
              element.dispatchEvent(new CustomEvent({
                detail: detail
              }))
            }
          }
        })

        listWatcher.observe(list, {
          childList: true,
          attributes: false,
          characterData: false,
          subtree: false
        })
      }
    }

    element.addEventListener('keyup', function (e) {
      if (e.code === 'Enter') {
        element.submit()
      }
    })

    Object.defineProperties(element.__proto__, {
      data: {
        enumerable: true,
        get: function () {
          return this.listData
        }
      },

      /**
       * @property uploadSource
       * A reference to the file browser source field.
       */
      filesource: {
        enumerable: true,
        get: function () {
          return this.shadowRoot.lastChild
        }
      },

      /**
       * @property inputField
       * A reference to the input field.
       * @private
       */
      inputField: {
        enumerable: true,
        get: function () {
          return element
        }
      },

      /**
       * @method browse
       * Browse for files.
       */
      browse: {
        value: function () {
          if (this.getAttribute('type') === 'file') {
            this.click()
          }
        }
      },

      submit: {
        enumerable: false,
        value: function () {
          var inputData = this.splitInput(this.inputField.value)

          if (inputData.length === 0) {
            this.inputField.value = ''
            return
          }

          if (this.deduplicate) {
            inputData = this.deduplicateData(inputData)
          }

          this.inputField.value = ''

          if (inputData.length === 0) {
            return
          }

          this.append(inputData)
        }
      },

      splitInput: {
        enumerable: false,
        value: function (input) {
          var me = element

          input = input
            .replace(new RegExp(this.separator + '{1,1000}', 'gi'), this.separator)
            .split(this.separator)
            .map(function (value) {
              return value.toString().trim()
            })
            .filter(function (value, i, a) {
              if (me.deduplicateInput) {
                if (a.indexOf(value) !== i) {
                  return false
                }
              }

              return value.toString().length > 0
            })

          return input
        }
      },

      deduplicateData: {
        enumerable: false,
        value: function (array) {
          return array.filter(function (element, index, a) {
            return a.indexOf(element) === index
          })
        }
      },

      spliceArgs: {
        enumerable: false,
        value: function (argumentObject) {
          var args = []

          if (argumentObject[0] instanceof Array) {
            args = argumentObject[0]
          } else {
            args = Array.prototype.slice.call(argumentObject)
          }

          return args
        }
      },

      /**
       * @method append
       * Append data items to the list. This method can take any number
       * of data item arguments. It can also take a single array argument.
       *
       * **Example**
       *
       * ```js
       * mylist.append('item1', 'item2', 'more items')
       *
       * // OR
       *
       * mylist.append(['item1', 'item2', 'more items'])
       * ```
       * @param {array} [items]
       * An array of items.
       */
      append: {
        enumerable: true,
        value: function () {
          if (arguments.length === 0) {
            throw new Error('addData requires at least one argument.')
          }

          var args = this.spliceArgs(arguments)

          if (this.deduplicate) {
            args = this.deduplicateData(args)
          }

          this.listData = this.listData.concat(args)

          if (this.deduplicate) {
            this.listData = this.deduplicateData(this.listData)
          }

          this.dispatchEvent(new CustomEvent('append', { // eslint-disable-line no-undef
            detail: {
              data: args
            }
          }))

          this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
            detail: {
              created: args,
              deleted: [],
              modified: []
            }
          }))
        }
      },

      /**
       * @method remove
       * Remove the item at a specified index or indexes. Pass `-1` or `null`
       * to remove everything.
       *
       * **Example**
       *
       * ```js
       * mylist.remove(null) // Removes everything (same as clear())
       * mylist.remove(-1) // Removes everything (same as clear())
       * mylist.remove(0) // Removes the first list item.
       * mylist.remove(0, 3) // Remove the first and fourth list items.
       * ```
       * @param {number[]} index
       */
      remove: {
        enumerable: true,
        value: function () {
          if (arguments.length === 0) {
            return this.clear()
          } else if (arguments[0] === null || arguments[0] === -1) {
            return this.clear()
          }

          var args = this.spliceArgs(arguments)
          var removed = []

          this.listData = this.listData.filter(function (data, index) {
            if (args.indexOf(index) < 0) {
              removed.push(data)
              return false
            }
          })

          this.dispatchEvent(new CustomEvent('remove', { // eslint-disable-line no-undef
            detail: {
              data: removed
            }
          }))

          this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
            detail: {
              created: [],
              deleted: removed,
              modified: []
            }
          }))
        }
      },

      /**
       * @method clear
       * Removes all items from the data list.
       */
      clear: {
        enumerable: true,
        value: function () {
          this.dispatchEvent(new CustomEvent('remove', { // eslint-disable-line no-undef
            detail: {
              data: this.listData
            }
          }))

          this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
            detail: {
              created: [],
              deleted: this.listData,
              modified: []
            }
          }))

          this.listData = []
        }
      },

      /**
       * @method setItem
       * Modify a specific data list value at a given index.
       * @param {number} index
       * The index of the item within the list (0-based indexing).
       */
      setItem: {
        enumerable: true,
        value: function (index, value) {
          if (index >= this.listData.length || index < 0) {
            throw new Error('Index out of bounds. Must be between 0 and the size of the list (current max value: ' + (this.listData.length === 0 ? 0 : (this.listData.length - 1)) + ')')
          }

          var oldValue = this.listData[index]
          this.listData[index] = value

          this.dispatchEvent(new CustomEvent('modified', { // eslint-disable-line no-undef
            detail: {
              index: index,
              old: oldValue,
              new: this.listData[index]
            }
          }))

          this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
            detail: {
              created: [],
              deleted: [],
              modified: [{old: oldValue, new: this.listData[index], index: index}]
            }
          }))
        }
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log(document.querySelectorAll('.chassis-listinput'))
  document.querySelectorAll('.chassis-listinput').forEach(function (element) {
    chassis.listinput(element)
  })
})

// class ChassisListInput extends HTMLInputElement {
//   constructor () {
//     super()
//
//     console.log('YO')
//   }
//
//   createdCallback () {
//     super.createdCallback()
//   }
// }
//
// document.registerElement('chassis-listinput', ChassisListInput)

// /**
//  * @component chassis-listinput
//  * A component that maintains a small dataset of it's elements.
//  * @fires append
//  * A payload is sent with the data that was added to the list.
//  *
//  * **Example**
//  *
//  * ```js
//  * {
//  *   detail: {
//  *   	 data: ['item1', 'item2']
//  *   }
//  * }
//  * ```
//  * @fires update
//  * Triggered whenever the list is modified. The modifications are
//  * delivered to event handlers.
//  *
//  * ```js
//  * {
//  *   detail: {
//  *     created: ['item1', 'item2'], // The values added to the list.
//  *     deleted: ['item1', 'item2'], // The values removed from the list.
//  *     modified: [                  // The modified values.
//  *     	 {old: 'item1', new: 'item1_changed', index: 0},
//  *     	 {old: 'item2', new: 'item2_changed', index: 1}
//  *     ]
//  *   }
//  * }
//  * ```
//  * @fires remove
//  * Triggered when data is removed from the list.
//  *
//  * **Example Payload**
//  * ```js
//  * {
//  *   detail: {
//  *     data: ['item1', 'item2']
//  *   }
//  * }
//  * ```
//  * @fires modify
//  * Triggered when a list data item is changed.
//  *
//  * **Example Payload**
//  * ```js
//  * {
//  *   detail: {
//  *     index: 0, // First item in the list.
//  *     old: 'oldValue',
//  *     new: 'newValue' // Current value.
//  *   }
//  * }
//  * ```
//  */
// var ChassisListinput = document.registerElement('chassis-listinput', { // eslint-disable-line, no-undef
//   prototype: Object.create(HTMLInputElement.prototype, { // eslint-disable-line no-undef
//
//     initTpl: {
//       enumerable: false,
//       value: function () {
//         var tag = 'chassis-listinput'
//         var src = document.querySelector('script[src*="' + tag + '"]') || document.querySelector('link[href*="' + tag + '.html"]')
//
//         document.body.classList.add('chassis')
//
//         if (src) {
//           src = (src.hasAttribute('src') ? src.getAttribute('src') : src.getAttribute('href')).replace(/\\/g, '/')
//           src = src.split('/')
//           src.pop()
//           src = src.join('/') + '/template.html'
//           var req = new XMLHttpRequest()
//           var me = this
//           req.addEventListener('load', function () {
//             var content = this.responseText.replace(/\n|\s+/g, ' ').replace(/\s\s/g, ' ').replace(/<(\/?)template(.*?)>/gi, '')
//             var shadow = me.createShadowRoot()
//             var ph = document.createElement('p')
//             ph.insertAdjacentHTML('afterbegin', content)
//             Array.prototype.slice.call(ph.children).forEach(function (el) {
//               shadow.appendChild(document.importNode(el, true))
//             })
//           })
//           req.open('GET', src)
//           req.send()
//         } else {
//           this.createShadowRoot()
//         }
//       }
//     },
//
//     createdCallback: {
//       value: function () {
//         this.initTpl()
//
//         Object.defineProperties(this, {
//           listData: {
//             enumerable: false,
//             writable: true,
//             configurable: false,
//             value: []
//           },
//
//           separator: {
//             enumerable: false,
//             writable: true,
//             configurable: false,
//             value: this.attributes.hasOwnProperty('separator') ? this.getAttribute('separator') : ','
//           },
//
//           deduplicate: {
//             enumerable: false,
//             writable: true,
//             configurable: false,
//             value: this.attributes.hasOwnProperty('deduplicate') ? this.getAttribute('deduplicate') === 'true' : true
//           },
//
//           deduplicateInput: {
//             enumerable: false,
//             writable: true,
//             configurable: false,
//             value: this.attributes.hasOwnProperty('deduplicateInput') ? this.getAttribute('deduplicateInput') === 'true' :
//               (this.attributes.hasOwnProperty('deduplicate') ? this.getAttribute('deduplicate') === 'true' : true)
//           }
//         })
//
//         var me = this
//         console.info(this.styleSheets)
//
// console.dir(document.styleSheets)
//         setTimeout(function () {
//           console.dir(me.parentStylesheet)
//           console.log(me.shadowRoot.getElementById('maininput'))
//           Object.keys(me.attributes).forEach(function (attribute) {
//             me.shadowRoot.getElementById('maininput').setAttribute(me.attributes[attribute].name, me.attributes[attribute].value)
//           })
//           console.log(me.getComputedStyles(me.shadowRoot.getElementById('maininput')))
//         }, 1)
//
//         // var inputElement = document.createElement('input')
//         // Object.keys(this.attributes).forEach(function (attribute) {
//         //   inputElement.setAttribute(me.attributes[attribute].name, me.attributes[attribute].value)
//         // })
//         //
//         // this.shadowRoot.appendChild(inputElement)
//
//         if (this.attributes.hasOwnProperty('for')) {
//           var list = this.querySelector('#' + this.getAttribute('for'))
//
//           if (list === null) {
//             throw new Error('The specified DOM element, ' + this.getAttribute('for') + ', could not be found or does not exist.')
//           } else {
//             var listWatcher = new MutationObserver(function (mutations) {
//               for (var m in mutations) {
//                 if (mutations[m].type === 'childList') {
//                   // if (mutations[m].addedNode)
//                   detail = mutations[m]
//                   me.dispatchEvent(new CustomEvent({
//                     detail: detail
//                   }))
//                 }
//               }
//             })
//
//             listWatcher.observe(list, {
//               childList: true,
//               attributes: false,
//               characterData: false,
//               subtree: false
//             })
//           }
//         }
//
//         this.addEventListener('keyup', function (e) {
//           if (e.code === 'Enter') {
//             me.submit()
//           }
//         })
//       }
//     },
//
//     getComputedStyles: {
//       enumerable: false,
//       value: function (element) {
//         return element.currentStyle || window.getComputedStyle(element)
//       }
//     },
//
//     data: {
//       enumerable: true,
//       get: function () {
//         return this.listData
//       }
//     },
//
//     /**
//      * @property uploadSource
//      * A reference to the file browser source field.
//      */
//     filesource: {
//       enumerable: true,
//       get: function () {
//         return this.shadowRoot.lastChild
//       }
//     },
//
//     /**
//      * @property inputField
//      * A reference to the input field.
//      * @private
//      */
//     inputField: {
//       enumerable: true,
//       get: function () {
//         return this.shadowRoot.getElementById('maininput')
//       }
//     },
//
//     /**
//      * @method browse
//      * Browse for files.
//      */
//     browse: {
//       value: function () {
//         this.shadowRoot.lastChild.click()
//       }
//     },
//
//     submit: {
//       enumerable: false,
//       value: function () {
//         var inputData = this.splitInput(this.inputField.value)
//
//         if (inputData.length === 0) {
//           this.inputField.value = ''
//           return
//         }
//
//         var me = this
//
//         if (this.deduplicate) {
//           inputData = this.deduplicateData(inputData)
//         }
//
//         this.inputField.value = ''
//
//         if (inputData.length === 0) {
//           return
//         }
//
//         this.append(inputData)
//       }
//     },
//
//     splitInput: {
//       enumerable: false,
//       value: function (input) {
//         var me = this
//
//         input = input
//           .replace(new RegExp(this.separator + '{1,1000}', 'gi'), this.separator)
//           .split(this.separator)
//           .map(function (value) {
//             return value.toString().trim()
//           })
//           .filter(function (value, i, a) {
//             if (me.deduplicateInput) {
//               if (a.indexOf(value) !== i) {
//                 return false
//               }
//             }
//
//             return value.toString().length > 0
//           })
//
//         return input
//       }
//     },
//
//     deduplicateData: {
//       enumerable: false,
//       value: function (array) {
//         return array.filter(function (element, index, a) {
//           return a.indexOf(element) === index
//         })
//       }
//     },
//
//     spliceArgs: {
//       enumerable: false,
//       value: function (argumentObject) {
//         var args = []
//
//         if (argumentObject[0] instanceof Array) {
//           args = argumentObject[0]
//         } else {
//           args = Array.prototype.slice.call(argumentObject)
//         }
//
//         return args
//       }
//     },
//
//     /**
//      * @method append
//      * Append data items to the list. This method can take any number
//      * of data item arguments. It can also take a single array argument.
//      *
//      * **Example**
//      *
//      * ```js
//      * mylist.append('item1', 'item2', 'more items')
//      *
//      * // OR
//      *
//      * mylist.append(['item1', 'item2', 'more items'])
//      * ```
//      * @param {array} [items]
//      * An array of items.
//      */
//     append: {
//       enumerable: true,
//       value: function () {
//         if (arguments.length === 0) {
//           throw new Error('addData requires at least one argument.')
//         }
//
//         var args = this.spliceArgs(arguments)
//
//         if (this.deduplicate) {
//           args = this.deduplicateData(args)
//         }
//
//         this.listData = this.listData.concat(args)
//
//         if (this.deduplicate) {
//           this.listData = this.deduplicateData(this.listData)
//         }
//
//         this.dispatchEvent(new CustomEvent('append', { // eslint-disable-line no-undef
//           detail: {
//             data: args
//           }
//         }))
//
//         this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
//           detail: {
//             created: args,
//             deleted: [],
//             modified: []
//           }
//         }))
//       }
//     },
//
//     /**
//      * @method remove
//      * Remove the item at a specified index or indexes. Pass `-1` or `null`
//      * to remove everything.
//      *
//      * **Example**
//      *
//      * ```js
//      * mylist.remove(null) // Removes everything (same as clear())
//      * mylist.remove(-1) // Removes everything (same as clear())
//      * mylist.remove(0) // Removes the first list item.
//      * mylist.remove(0, 3) // Remove the first and fourth list items.
//      * ```
//      * @param {number[]} index
//      */
//     remove: {
//       enumerable: true,
//       value: function () {
//         if (arguments.length === 0) {
//           return this.clear()
//         } else if (arguments[0] === null || arguments[0] === -1) {
//           return this.clear()
//         }
//
//         var args = this.spliceArgs(arguments)
//         var removed = []
//
//         this.listData = this.listData.filter(function (data, index) {
//           if (args.indexOf(index) < 0) {
//             removed.push(data)
//             return false
//           }
//         })
//
//         this.dispatchEvent(new CustomEvent('remove', { // eslint-disable-line no-undef
//           detail: {
//             data: removed
//           }
//         }))
//
//         this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
//           detail: {
//             created: [],
//             deleted: removed,
//             modified: []
//           }
//         }))
//       }
//     },
//
//     /**
//      * @method clear
//      * Removes all items from the data list.
//      */
//     clear: {
//       enumerable: true,
//       value: function () {
//         this.dispatchEvent(new CustomEvent('remove', { // eslint-disable-line no-undef
//           detail: {
//             data: this.listData
//           }
//         }))
//
//         this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
//           detail: {
//             created: [],
//             deleted: this.listData,
//             modified: []
//           }
//         }))
//
//         this.listData = []
//       }
//     },
//
//     /**
//      * @method setItem
//      * Modify a specific data list value at a given index.
//      * @param {number} index
//      * The index of the item within the list (0-based indexing).
//      */
//     setItem: {
//       enumerable: true,
//       value: function (index, value) {
//         if (index >= this.listData.length || index < 0) {
//           throw new Error('Index out of bounds. Must be between 0 and the size of the list (current max value: ' + (this.listData.length === 0 ? 0 : (this.listData.length - 1)) + ')')
//         }
//
//         var oldValue = this.listData[index]
//         this.listData[index] = value
//
//         this.dispatchEvent(new CustomEvent('modified', { // eslint-disable-line no-undef
//           detail: {
//             index: index,
//             old: oldValue,
//             new: this.listData[index]
//           }
//         }))
//
//         this.dispatchEvent(new CustomEvent('update', { // eslint-disable-line no-undef
//           detail: {
//             created: [],
//             deleted: [],
//             modified: [{old: oldValue, new: this.listData[index], index: index}]
//           }
//         }))
//       }
//     }
//   })
// })
