var NgnOverlay = document.registerElement('ngn-overlay', { // eslint-disable-line, no-undef
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
				document.body.classList.add('chassis')
				var content = '<template> <style> @charset "UTF-8"; :host { background: rgba(0,0,0,.6); display: flex; position: fixed; top: 0; right: 0; bottom: 0; left: 0; margin: 0; padding: 0; align-items: center; justify-content: center; } ngn-overlay { background: rgba(0,0,0,.6); display: flex; position: fixed; top: 0; right: 0; bottom: 0; left: 0; margin: 0; padding: 0; align-items: center; justify-content: center; } </style> <!-- <ngncontent id="host" class="active"> --> <content></content> <!-- </ngncontent> --> </template> '.replace(/<(\/?)template(.*?)>/gi,'')
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
        this.initTpl()
      }
    }
  })
})
