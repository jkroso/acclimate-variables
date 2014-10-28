
var children = require('ast-children')
var concat = Function.call.bind([].concat)
var freeVars = require('free-variables')
var reserved = require('./reserved')

/**
 * to Object
 */

reserved = reserved.reduce(function(map, name){
  map[name] = name + '_'
  return map
}, Object.create(null))

/**
 * rename all references to `it` in or below `nodes`'s
 * scope to `to`
 *
 * @param {AST} node
 * @param {String} it
 * @param {String} to
 */

function walk(node, env){
  switch (node.type) {
    case 'Identifier':
      return node.name = env[node.name] || jsIfy(node.name, env)
    case 'FunctionDeclaration':
    case 'FunctionExpression':
    case 'CatchClause':
      env = Object.create(env)
      freshVars(node).forEach(function(name){
        var to = jsIfy(name, env)
        env[name] = to
        env[to] = to
      })
      break
  }
  children(node).forEach(function(child){
    walk(child, env)
  })
}

/**
 * convert `str` to be a valid/idiomatic JS variable name
 *
 * @param {String} str
 * @param {Object} reserved
 * @return {String}
 */

function jsIfy(str, reserved){
  if (/\?$/.test(str)) str = 'is' + capitalize(str.slice(0, -1))
  str = str
    .replace(/(\w)?->(\w)?/g, function(_, p, w){
      return (p ? p + 'To' : 'to') + w.toUpperCase()
    })
    .replace(/-(\w)/g, function(_, w){ return w.toUpperCase() })
    .replace(/\%/g,    'Percent')
    .replace(/</g ,    'LAngle')
    .replace(/>/g ,    'RAngle')
    .replace(/\?/g,    'Query')
    .replace(/\//g,    'Slash')
    .replace(/\+/g,    'Plus')
    .replace(/=/g ,    'Equals')
    .replace(/\./g,    'Dot')
    .replace(/\*/g,    '_')
  while (str in reserved) str += '_'
  return str
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * get all declared variables within `node`'s scope
 *
 * @param {AST} node
 * @return {Array}
 */

function freshVars(node){
  switch (node.type) {
    case 'VariableDeclaration':
      return node.declarations.map(function(n){ return n.id.name })
    case 'FunctionExpression': return [] // early exit
    case 'FunctionDeclaration': return [node.id.name]
    case 'CatchClause': return [node.param.name]
  }
  return children(node)
    .map(freshVars)
    .reduce(concat, [])
}

function acclimate(node){
  var env = Object.create(reserved)
  freeVars(node).forEach(function(name){
    var to = jsIfy(name, env)
    env[name] = to
    env[to] = to
  })
  walk(node, env)
  return node
}

module.exports = acclimate
