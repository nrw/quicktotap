var through2 = require('through2')
var split = require('split')
var combine = require('stream-combiner')

module.exports = Filter

function Filter (options) {
  options = options || {}
  options.debug = options.debug || false
  options.verbose = options.verbose || false

  var total = 0
  var failed = 0
  var first = true

  var err = /^(\/.*?) error:.*?\[.*? (.+)\].*?expected (.*?), got (.*?$)/
  var isTest = /(^\s+Executed .*? seconds$|^Test)/
  var message, match

  return combine(split('\n'), through2(
    function (chunk, enc, cb) {
      if (first) {
        this.push('TAP version 13\n')
        first = false
      }

      var str = chunk.toString('utf8')
      var line



      // console.log(match[1])
      if ((match = str.match(/^Test Suite '([^']*?)' started/))) {
        this.push('# ' + match[1] + '\n')
      } else if ((match = str.match(err))) {
        total++
        failed++
        this.push('not ok ' + total + ' ' + match[2].replace(/_/g, ' ') + '\n')
        this.push('  ---\n')
        this.push('  location: ' + match[1].replace(/[<>]/g, '') + '\n')
        this.push('  expected: ' + match[3].replace(/[<>]/g, '') + '\n')
        this.push('  actual:   ' + match[4].replace(/[<>]/g, '') + '\n')
        this.push('  ...\n')
      } else if ((match = str.match(/^Test Case .*?\[.*? (.+)\]' passed/))) {
        total++
        this.push('ok ' + total + ' ' + match[1].replace(/_/g, ' ') + '\n')
      } else {
        if (options.verbose) {
          this.push(str + '\n')
        } else if (options.debug && !isTest.test(str)) {
          this.push(str + '\n')
        }
      }

      cb()
    },
    function (cb) {
      this.push('\n')
      this.push('1..' + total + '\n')
      this.push('# tests ' + total + '\n')
      this.push('# pass  ' + (total - failed))
      this.push('\n\n')
      this.push(failed ? '# fail  ' + failed : '# ok')
      this.push('\n\n')

      process.on('exit', function () {
        process.exit(failed ? 1 : 0)
      })

      cb()
    }
  ))
}
