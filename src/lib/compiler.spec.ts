import test from 'ava';

import { compile } from './compiler';

test.skip('compiles simple variable declaration', t => {
  const fs = 'let x = 5';
  const js = 'let x = 5;';

  const compiled = compile(fs);

  t.is(compiled, js);
});

test.skip('compiles simple function declaration', t => {
  const fs = `let f x = x + 1`;
  const js =
    'function f(x) {' +
    '  return x + 1;' +
    '}';
  
  // Whether I should use lambda notation or classical function notation is an open question.
  // const js = `
  //   let f = x => x + 1;
  // `;

  const compiled = compile(fs);

  t.is(compiled, js);
});

test.skip('compiles assignment with print to console', t => {
  const fs = `
    let x = 5
    print x
  `;

  const js = `
    let x = () => 5;
    console.log(x());
  `;

  const compiled = compile(fs);

  t.is(compiled, js);
});
