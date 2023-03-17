# FunkScript

FunkScript is experimental functional language that is compiled to JavaScript.

Work in progress.

Some example snippets from the language:

```
let x = 5
print x
```

```
0..3
|> filter x => x < 3
|> map x => x + 1
|> print
```

```
let sum a b = a + b

let a = 2
let b = 3

let result = sum a b

print result
```
