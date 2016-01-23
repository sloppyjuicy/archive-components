'use strict'

module.exports = function (component, callback) {
  if (document) {
    component = (Array.isArray(component) : Array : [component])
    component.forEach(function (tag) {
      var s = document.createElement('script')
      s.setAttribute('type', 'text/javascript')
      s.setAttribute('src', require('path').join(__dirname, 'dist/' + tag + '.min.js'))
      document.head.appendChild(s)
    })
  } else {
    console.log('NGN Chassis failed to load ' + component + ': DOM does not exist or was not recognized.')
  }
}
