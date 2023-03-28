/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export function tokenize(input: string): Token[] {

  const lines = input.split('\n');

  let context = TokenContext.none;

  const result = lines.map(line => {
    const words = line.split(' ');

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
  
      if (word === '+') {
        return token(word, TokenType.plus);
      }
  
      if (context === TokenContext.declaring) {
        return token(word, TokenType.symbol);
      }
  
      if (context === TokenContext.assigning) {
        if (!isNaN(word as any)) {
          return token(word, TokenType.literal);
        } else {
          return token(word, TokenType.symbol);
        }
      }
  
      if (context === TokenContext.none) {
        // here we should detect whether it's number, string or anything
        if (!isNaN(word as any)) {
          return token(word, TokenType.literal);
        }
      }
  
      throw new Error(`Unexpected token: ${word}, context: ${context}`);  
    })
    .flat()
    .concat(token('\n', TokenType.endOfLine));
  })
  .flat();

  return result;
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
  none = 'none',
  declaring = 'declaring',
  assigning = 'assigning',
}

export enum TokenType {
  declaration = 'declaration',
  endOfLine = 'endOfLine',
  equal = 'equal',
  literal = 'literal',
  plus = 'plus',
  symbol = 'symbol', // rename to symbol ? key ? variableName ?
}
