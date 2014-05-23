
var rename = require('rename-variables')
var gen = require('escodegen').generate
var parse = require('esprima').parse
var acclimate = require('..')

function test(from, name, to){
  var a = parse(String(from))
  var b = parse(String(to))
  rename(a, 'a', name)
  acclimate(a)
  try { a.should.eql(b) }
  catch (e) {
    console.log()
    console.log(gen(a))
    throw e
  }
}

it('free variables', function(){
  test('a', 'b', 'b')
  test('a', 'a->b', 'aToB')
  test('a', '->b', 'toB')
})

it('declarations', function(){
  test('var a', 'a?', 'var isA')
  test('function a(){}', 'a?', 'function isA(){}')
})

it('multiple scopes', function(){
  test('function a(){a};a', 'a-b', 'function aB(){aB};aB')
  test('(function a(){a});a', 'a-b', '(function a(){a});aB')
})

it('try-catch', function(){
  test('try{a}catch(a){a}', 'a.b', 'try{aDotb}catch(a){a}')
})

it('member expressions', function(){
  test('a[a]', 'a/b', 'aSlashb[aSlashb]')
  test('a.a', 'a/b', 'aSlashb.a')
})
