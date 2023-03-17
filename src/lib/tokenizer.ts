/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export function tokenize(input: string): Token[] {
  const words = input
    .split('\n')
    .map(line => line.split(' '))
    .flat();

  console.log('tokenize', { input, words });

  let context = TokenContext.none;
  // let line = 0;
  // let indentation = 0;

  return words.map(word => {
    if (context === TokenContext.none) {
      if (word === '\n' || word === ' ') {
        return undefined;
      }
    }

    if (word === 'let') {
      context = TokenContext.declaring;
      return token(word, TokenType.declaration);
    }

    if (word === '=') {
      context = TokenContext.assigning;
      return token(word, TokenType.equal);
    }

    if (context === TokenContext.declaring) {
      context = TokenContext.none;
      return token(word, TokenType.symbol);
    }

    if (context === TokenContext.assigning) {
      context = TokenContext.none;
      return token(word, TokenType.literal);
    }

    throw new Error('Unhandled path');
  });
}

export function token(value: string, type: TokenType /*, line: number, indentation: number */): Token {
  // rename indentation to column?
  // return { value, type, line, indentation };
  return { value, type };
}

export type Token = {
  // readonly indentation: number;
  // readonly line: number;
  readonly type: TokenType;
  readonly value: string;
};

export enum TokenContext {
  none,
  declaring,
  assigning,
}

export enum TokenType {
  declaration,
  equal,
  symbol, // rename to symbol ? key ? variableName ?
  literal,
}
