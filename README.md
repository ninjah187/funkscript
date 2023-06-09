# FunkScript

FunkScript is experimental functional language that is compiled to JavaScript.

Work in progress.

Some example snippets:

```
Variable definition:

==================
=== FunkScript ===
==================

let x = 5

==================
=== JavaScript ===
==================

function x() {
  return 5;
}
```

```
Function definition:

==================
=== FunkScript ===
==================

let f x = x + 1

==================
=== JavaScript ===
==================

function f(x) {
  return x + 1;
}
```

```
Function definition and call:

==================
=== FunkScript ===
==================

let sum a b = a + b

let a = 2
let b = 3

let result = sum a b

print result

==================
=== JavaScript ===
==================

function sum(a) {
  return function (b) {
    return a + b;
  };
}

const a = 2;
const b = 3;

const result = sum(a)(b);

console.log(result);
```

```
Lazy sequences:

==================
=== FunkScript ===
==================

0..4
|> filter x => x < 3
|> map x => x + 1
|> print

==================
=== JavaScript ===
==================

function* sequence(start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

function pipe(value, functions) {
  return functions.reduce((x, f) => f(x), value);
}

function filter(predicate) {
  return function (items) {
    for (const item of items) {
      if (predicate(items)) {
        yield item;
      }
    }
  };
}

function map(mapper) {
  return function (items) {
    for (const item of items) {
      yield mapper(item);
    }
  };
}

pipe(
  sequence(0, 3),
  filter(x => x < 3),
  map(x => x + 1),
  x => console.log(x)
);
```
