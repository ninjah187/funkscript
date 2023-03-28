/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import test from 'ava';
import { emit } from './emitter';
import { tokenize } from './tokenizer';
import { parse } from './parser';

test('emitter can emit simple variable declaration', t => {
  const fs = 'let x = 5';

  // Should everything be function? Or should I allow literal variables?
  // const js = 'let x = 5;'
  
  const js =
    'function x() {\n' +
    '  return 5;\n' +
    '}';

  const emitted = testEmit(fs);

  t.is(emitted, js);
});

test('emitter can emit multiple variables declarations', t => {
  const fs =
    'let a = 2\n' +
    'let b = 3';

  const emitted = testEmit(fs);

  const js =
  'function a() {\n' +
  '  return 2;\n' +
  '}\n' +
  'function b() {\n' +
  '  return 3;\n' +
  '}';

  t.is(emitted, js);
});

test('emitter can emit one-line function declaration with parameter', t => {
  const fs = 'let f x = x + 1';

  const js =
  'function f(x) {\n' +
  '  return x + 1;\n' +
  '}';

  const emitted = testEmit(fs);

  t.is(emitted, js);
});

function testEmit(input: string): string {
  const tokens = tokenize(input);
  const [tree] = parse(tokens);
  return emit(tree);
}
