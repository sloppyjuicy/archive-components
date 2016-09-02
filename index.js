'use strict'

module.exports = function (component, callback) {
  if (document) {
    component = Array.isArray(component) ? component : [component]
    let ct = component.length
    let done = function () {
      ct--
      ct === 0 && callback()
    }
    component.forEach(function (tag) {
      var s = document.createElement('script')
      s.setAttribute('type', 'text/javascript')
      s.setAttribute('src', require('path').join(__dirname, tag + '.min.js'))
      s.onload = done
      document.head.appendChild(s)
    })
  } else {
    console.log('NGN Chassis failed to load ' + component + ': DOM does not exist or was not recognized.')
  }
}
