
# acclimate-variables

  rename all invalid identifiers in an AST

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
