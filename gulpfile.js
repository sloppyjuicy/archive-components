'use strict'

const gulp = require('gulp')
const concat = require('gulp-concat')
const prompt = require('gulp-prompt')
const uglify = require('uglify-js')
// const header = require('gulp-header')
const esprima = require('esprima')
const traverse = require('traverse')
const del = require('del')
const fs = require('fs')
const path = require('path')
const pkg = require('./package.json')
const headerComment = '/**\n  * v' + pkg.version + ' generated on: ' + (new Date()) + '\n  * Copyright (c) 2014-' + (new Date()).getFullYear() + ', Corey Butler. All Rights Reserved.\n  */\n'

const DIR = {
  source: path.resolve('./tags'),
  dist: path.resolve('./dist')
}

// Build a release
gulp.task('build', ['version', 'clean', 'copy'])

// Check versions for Bower & npm
gulp.task('version', function (next) {
  console.log('Checking versions.')

  // Sync Bower
  // var bower = require('./bower.json')
  // if (bower.version !== pkg.version) {
  //   console.log('Updating bower package.')
  //   bower.version = pkg.version
  //   fs.writeFileSync(path.resolve('./bower.json'), JSON.stringify(bower, null, 2))
  // }
})

// Create a clean build
gulp.task('clean', function (next) {
  console.log('Cleaning distribution.')
  if (fs.existsSync(DIR.dist)) {
    del.sync(DIR.dist)
  }
  fs.mkdirSync(DIR.dist)
  next()
})

gulp.task('copy', function () {
  console.log('Copying distribution files to ', DIR.dist)

  // Process each tag directory
  let sources = fs.readdirSync(DIR.source).filter(function (p) {
    p = path.join(DIR.source, p)
    return fs.statSync(p).isDirectory()
      && fs.existsSync(path.join(p, 'tag.js'))
  })

  sources.forEach(function (dir) {
    let str = fs.readFileSync(path.join(DIR.source, dir, 'tag.js')).toString()

    let initScript = esprima.parse(str, {
      range: true
    })

    let initTplRange = null
    traverse(initScript).reduce(function (acc, x) {
      if (this.node
        && this.node.type
        && this.node.type === 'Property'
        && this.node.key
        && this.node.key.name === 'initTpl') {
        initTplRange = this.node.value.properties.filter(function (p) {
          return p.key.name.trim().toLowerCase() === 'value'
        })[0].value.body.range
      }
    })

    let tpl = null
    let tplfile = path.join(DIR.source, dir, 'template.html')
    if (fs.existsSync(tplfile)) {
      tpl = fs.readFileSync(tplfile).toString()
      tpl = tpl.replace(/\n|\s+/g, ' ').replace(/\s\s/g, ' ')
      tpl = '{\n'
        + '\tvar content = \'' + tpl + '\'.replace(\/<(\\/?)template(.*?)>\/gi,\'\')\n'
        + '\tvar shadow = this.createShadowRoot()\n'
        + '\tvar ph = document.createElement(\'p\')\n'
        + '\tph.insertAdjacentHTML(\'afterbegin\', content)\n'
        + '\tArray.prototype.slice.call(ph.children).forEach(function (el) {\n'
        + '\t\tshadow.appendChild(document.importNode(el, true))\n'
        + '\t})\n'
        + '\tdelete ph\n}\n'
        console.log(tpl)
    }
    if (tpl) {
      str = str.replace(str.substr(initTplRange[0], initTplRange[1] - initTplRange[0]), tpl)
    }
    let c = uglify.minify(str.toString(), {
      fromString: true
    })
    fs.writeFileSync(path.join(DIR.dist, dir + '.js'), str)
    fs.writeFileSync(path.join(DIR.dist, dir + '.min.js'), headerComment + c.code)
    fs.writeFileSync(path.join(DIR.dist, dir + '.html'), '<script src="text/javascript">\n' + headerComment + c.code + '\n</script>')
  })
})

gulp.task('create', function () {
  return gulp.src('gulpfile.js')
    .pipe(prompt.prompt([{
      type: 'input',
      name: 'tag',
      message: 'Tag Name:',
      'default': 'ngn-tag',
      validate: function (input) {
        if (input.split('-').filter(function (el) {
          return el.trim().length > 0
        }).length > 1) {
          if (!fs.existsSync(path.join('./tags', input.toLowerCase()))) {
            return true
          }
          return input.toLowerCase() + ' already exists. Choose another name.'
        }
        return 'Must be in the format of [scope]-[tag].'
      }
    },{
      type: 'confirm',
      name: 'tpl',
      message: 'Create an HTML Shadow DOM template?',
      'default': true
    }], function (a) {
      // Create the new source directory
      let d = path.join(DIR.source, a.tag.toLowerCase())
      console.log(d)
      fs.mkdirSync(d)

      // Add the templates
      let tag = fs.readFileSync(path.join(DIR.source, 'tag.template')).toString()
      let readme = fs.readFileSync(path.join(DIR.source, 'README.template')).toString()

      let nm = a.tag.split('-').map(function (el) {
        return el.substr(0,1).toUpperCase() + el.substr(1,el.length)
      }).join('')

      let tpl = [{name: 'tag.js', tpl: tag }, {name:'README.md', tpl: readme}]
      if (a.tpl) {
        tpl.push({
          name: 'template.html',
          tpl: fs.readFileSync(path.join(DIR.source, 'html.template')).toString()
        })
      }

      tpl.forEach(function (file) {
        let content = file.tpl.replace(/\{\{TagName\}\}/gi, a.tag.toLowerCase()).replace(/\{\{TagVariableName\}\}/gi, nm)
        fs.writeFileSync(path.join(d, file.name), content)
      })

      console.log('The custom tag code is ready in', d)
    }))
})
