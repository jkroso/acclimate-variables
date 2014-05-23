
# acclimate-variables

  rename all invalid identifiers in an AST

## Motivation

When compiling to JS its a pain to worry if the identifiers you generate are safe to use in JS code. And if not what is. With this module you just don't worry it at all then, just before you generate your JS, run your AST through the `acclimate` function.

## Installation

With your favorite package manager:

- [packin](//github.com/jkroso/packin): `packin add jkroso/acclimate-variables`
- [component](//github.com/component/component#installing-packages): `component install jkroso/acclimate-variables`
- [npm](//npmjs.org/doc/cli/npm-install.html): `npm install acclimate-variables`

then in your app:

```js
var acclimate = require('acclimate-variables')
```

## API

### acclimate(node)

translate all identifiers in `node` to ones safe to use in JS code.

```js
acclimate({type:'Identifier', name: 'number->string'}) // => {type:'Identifier', name: 'numberToString'}
acclimate({type:'Identifier', name: 'string?'}) // => {type:'Identifier', name: 'isString'}
```
