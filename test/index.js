var test = require('tape')
var concat = require('concat-stream')
var fs = require('fs')

var Filter = require('..')
var filter

test('topic', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    t.equal(data.toString(), [
      'TAP version 13',
      '# MyAppTests.xctest',
      '',
      '1..0',
      '# tests 0',
      '# pass  0',
      '',
      '# ok',
      '',
      ''
    ].join('\n'))
    t.end()
  }))
  filter.end("Test Suite 'MyAppTests.xctest' started at 2015-05-01 23:22:41 +0000")
})

test('pass and fail', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    t.equal(data.toString(), [
      'TAP version 13',
      '# MyAppTests.xctest',
      'not ok 1 end log fade',
      '  ---',
      '  location: /Users/test/dev/MyApp/MyAppTests/MyAppTests.swift:19:',
      '  expected: to be close to 0.0000 (within 0.0000)',
      '  actual:   1.0000',
      '  ...',
      'ok 2 start log fade',
      '',
      '1..2',
      '# tests 2',
      '# pass  1',
      '',
      '# fail  1',
      '',
      ''
    ].join('\n'))
    t.end()
  }))
  filter.write("Test Suite 'MyAppTests.xctest' started at 2015-05-01 23:22:41 +0000\n")
  filter.end("/Users/test/dev/MyApp/MyAppTests/MyAppTests.swift:19: " +
    "error: -[MyAppTests.FaderTests end_log_fade] : failed - expected to be" +
    " close to <0.0000> (within 0.0000), got <1.0000>\n"+
    "Test Case '-[MyAppTests.FaderTests start_log_fade]' passed (0.004 seconds).\n")
})

test('full output pass', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    // console.log('\n\n\n\n')
    // console.log(data.toString())
    // console.log('\n\n\n\n')
    t.equal(data.toString(), fs.readFileSync(__dirname + '/pass-out.txt', 'utf8'))
    t.end()
  }))

  filter.end(fs.readFileSync(__dirname + '/pass-in.txt', 'utf8'))
})

test('full output fail', function (t) {
  filter = Filter()

  filter.pipe(concat(function (data) {
    // console.log('\n\n\n\n')
    // console.log(data.toString())
    // console.log('\n\n\n\n')
    t.equal(data.toString(), fs.readFileSync(__dirname + '/fail-out.txt', 'utf8'))
    t.end()
  }))

  filter.end(fs.readFileSync(__dirname + '/fail-in.txt', 'utf8'))
})
