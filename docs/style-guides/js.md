# origin-web-console JS style guide

A reasonable approach to assisting in style consistency in `openshift-web-console`
inspired by guides such as the style guide published by [airbnb](https://github.com/airbnb/javascript).

## ESLint

Run `grunt eslint` to check code for errors and style discrepancies.

## Examples


### Variables

Group your variable names but use individual `var` statements:

```javascript

// bad
var foo = function() {
  var bar = 1;
  if(bar === baz) {
    doStuff();
  }
  var qux = 2;
  // more code...
  var quux = 4;
  // more code...
}

// good
var foo = function() {
  var bar = 1;
  var qux = 2;
  var quux = 4;

  if(bar === baz) {
    doStuff();
  }
  // more code...
}

```


### Comparison Operators

Use `===` and `!==`.  Avoid `==` and `!=`.  This will avoid type coercion bugs:

```javascript

// bad
if(foo == bar) {
  // do stuff...
}

// good
if(foo === bar) {
  // do stuff
}

```


Shortcuts are recommended:

```javascript

// bad
if(foo !== '') {
  // do stuff
}

// good
if(foo) {
  // do stuff
}

// bad
if(list.length > 0){
  // do stuff
}

// good
if(list.length) {
  // do stuff
}

```


### blocks

Use braces with all blocks:

```javascript

// bad
if(foo) return false;

// bad
if(foo)
  return false;

// good
if(foo) {
  return false;
}

// bad
function() { return false; }

// good
function() {
  return false;
}

```

### Conditionals

Maintain compact symmetry with `if {} else if {} else {}` blocks:

```javascript

// bad
if(foo) {
  bar();
}
else if(qux) {
  baz();
}
else {
  quux();
}

// good
if(foo) {
  bar();
} else if {
  baz();
} else {
  quux();
}

```


Don't comment obvious things:

```javascript
// bad
var user = {
  // returns true if the user is logged in
  isLoggedIn: function() {

  }
}

```
Avoid excessive comments as a code smell.  Favor meaningful variable names.  This probably doesn't need an example.

Claim your todos and fixmes.  `FIXME (name):` to point out issues, `TODO (name):`
to point out solutions:

```javascript

// bad
var foo = function() {
  // FIXME: it doesn't do anything
  // TODO: it should do something.
}

// good
var foo = function() {
  // FIXME (bpeterse): it doesn't do anything
  // TODO (bpeterse): it should do something
}

```


### Whitespace

Use 2 spaces for a tab

```javascript
// bad
var foo = function() {
∙∙∙∙var bar = 1;
}
// good
var foo = function() {
∙∙var bar = 1;
}

```


### Commas & Semicolons

No leading commas, no extra trailing commas, no missing semicolons

```javascript
// bad
var foo = {
   bar: 1
 , baz: 2
 , qux: 3
}

// bad
var foo = {
  bar: 1,
  baz: 2,
  qux: 3,
}

// good
var foo = {
  bar: 1,
  baz: 2,
  qux: 3
}

// bad
var foo = function() {
  doStuff()
}

// good
var foo = function() {
  doStuff();
}
```

### Functions

Wrap IIFE's with a set of parens to help show it's purpose

```javascript
// bad
function() {
  // do stuff
}();

// good
(function() {
  // do stuff
})();

```
