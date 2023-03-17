/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import test from 'ava';

import { TokenType, token, tokenize } from './tokenizer';

test('tokenizer can tokenize simple assignment', t => {
  const fs = 'let x = 5';

  const expected = [
    token('let', TokenType.declaration,),
    token('x', TokenType.symbol),
    token('=', TokenType.equal),
    token('5', TokenType.literal),
  ];
  
  const tokens = tokenize(fs);

  t.deepEqual(tokens, expected);
});

test('tokenizer can tokenize multi lines', t => {
  // const fs = `
  //   let a = 2
  //   let b = 3
  // `;

  const fs =
    'let a = 2\n' +
    'let b = 3';

  const expected = [
    token('let', TokenType.declaration),
    token('a', TokenType.symbol),
    token('=', TokenType.equal),
    token('2', TokenType.literal),
    // eol token here ??
    token('let', TokenType.declaration),
    token('b', TokenType.symbol),
    token('=', TokenType.equal),
    token('3', TokenType.literal),
  ];

  const tokens = tokenize(fs);

  t.deepEqual(tokens, expected);
});
