# quicktotap [![build status](https://secure.travis-ci.org/nrw/quicktotap.png)](http://travis-ci.org/nrw/quicktotap)

A filter that turns [Quick](https://github.com/Quick/Quick) output into [TAP](http://testanything.org/) output.

## Install

```bash
npm install -g quicktotap
```

## Example

With a `runtests.sh` file containing something like this:

```bash
#!/usr/bin/env bash

xcodebuild test -workspace MyApp.xcworkspace -scheme MyApp -destination 'platform=iOS Simulator,name=iPhone 6'
```

Pipe the output through `quicktotap`

```bash
./runtests.sh | quicktotap
```

Outputs

```tap
TAP version 13
# All tests
# Quick.framework
# MyAppTests.xctest
# FaderTests
ok 1 simple fade
not ok 2 end log fade
  ---
  location: /Users/test/dev/MyApp/MyAppTests/MyAppTests.swift:19:
  expected: to be close to 0.0000 (within 0.0000)
  actual:   1.0000
  ...
not ok 3 end log fade
  ---
  location: /Users/test/dev/MyApp/MyAppTests/MyAppTests.swift:24:
  expected: to be close to 3.0000 (within 0.0000)
  actual:   1.0000
  ...
ok 4 start log fade
# SelectorTests
ok 5 mocks query
ok 6 selects first

1..6
# tests 6
# pass  4

# fail  2
```
