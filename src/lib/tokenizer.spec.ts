/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import test from 'ava';

import { Token, TokenType, token, tokenize } from './tokenizer';

test('tokenizer can tokenize simple assignment', t => {
  const fs = 'let x = 5';

  const expected = [
    token('let', TokenType.declaration,),
    token('x', TokenType.symbol),
    token('=', TokenType.equal),
    token('5', TokenType.literal),
    endOfLine()
  ];
  
  const tokens = tokenize(fs);

  t.deepEqual(tokens, expected);
});

test('tokenizer can tokenize multi lines', t => {
  const fs =
    'let a = 2\n' +
    'let b = 3';

  const expected = [
    token('let', TokenType.declaration),
    token('a', TokenType.symbol),
    token('=', TokenType.equal),
    token('2', TokenType.literal),
    endOfLine(),
    token('let', TokenType.declaration),
    token('b', TokenType.symbol),
    token('=', TokenType.equal),
    token('3', TokenType.literal),
    endOfLine(),
  ];

  const tokens = tokenize(fs);

  t.deepEqual(tokens, expected);
});

test('tokenizer can tokenize function declaration: one-liner with single parameter', t => {
  const fs = 'let f x = x + 1';

  const expected = [
    token('let', TokenType.declaration),
    token('f', TokenType.symbol),
    token('x', TokenType.symbol),
    token('=', TokenType.equal),
    token('x', TokenType.symbol),
    token('+', TokenType.plus),
    token('1', TokenType.literal),
    endOfLine(),
  ];

  const tokens = tokenize(fs);

  t.deepEqual(tokens, expected);
});

test('tokenizer can tokenize function declaration: one-liner with two parameters', t => {
  const fs = 'let sum a b = a + b';

  const expected = [
    token('let', TokenType.declaration),
    token('sum', TokenType.symbol),
    token('a', TokenType.symbol),
    token('b', TokenType.symbol),
    token('=', TokenType.equal),
    token('a', TokenType.symbol),
    token('+', TokenType.plus),
    token('b', TokenType.symbol),
    endOfLine(),
  ];

  const tokens = tokenize(fs);

  t.deepEqual(tokens, expected);
});

function endOfLine(): Token {
  return {
    type: TokenType.endOfLine,
    value: '\n'
  };
}