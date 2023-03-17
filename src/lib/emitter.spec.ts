/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import test from 'ava';
import { emit } from './emitter';
import { tokenize } from './tokenizer';
import { parse } from './parser';

test('emitter can emit simple variable declaration', t => {
  const fs = 'let x = 5';
  const js = 'let x = 5;'

  const emitted = testEmit(fs);

  t.is(emitted, js);
});

test('emitter can emit multiple variables declarations', t => {
  const fs =
    'let a = 2\n' +
    'let b = 3';

  const emitted = testEmit(fs);

  const js = 
    'let a = 2;\n' +
    'let b = 3;';

    t.is(emitted, js);
});

function testEmit(input: string): string {
  const tokens = tokenize(input);
  const [tree] = parse(tokens);
  return emit(tree);
}
