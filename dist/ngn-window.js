var NgnWindow = document.registerElement('ngn-window', { // eslint-disable-line, no-undef
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
