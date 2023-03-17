/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { Token, TokenType } from './tokenizer';

export type AbstractSyntaxTree = Node;

// class Node {
//   constructor(public readonly type: NodeType, public readonly children: readonly Node[]) {}
// }

// class MainNode {

// }

export type Node = {
  readonly type: NodeType,
  readonly children: readonly Node[]
};

export type MainNode = Node & {
  // readonly statements: readonly Node[]
};

export type DeclarationNode = Node & {
  readonly token: Token;
  readonly body: AssignmentNode;
  // readonly body: AssignmentNode;
};

export type AssignmentNode = Node & {
  readonly token: Token;
  readonly left: VariableNode;
  readonly right: ValueNode;
};

export type VariableNode = Node & {
  readonly token: Token;
};

export type ValueNode = Node & {
  readonly token: Token;
};



export enum NodeType {
  main = 'main',
  declare = 'declare',
  assign = 'assign',
  variable = 'variable',
  value = 'value',
}

// enum ParserContext {
//   none,
//   declaring,
//   assigning
// }

export type CompilationError = string;

export function parse(tokens: Token[]): readonly [AbstractSyntaxTree, CompilationError] {
  tokens = [...tokens];

  const statements: Node[] = [];

  while (tokens.length !== 0) {
    const token = tokens.shift();

    if (token.type === TokenType.declaration) {
      const symbol = tokens.shift();
      const equal = tokens.shift();
      const value = tokens.shift();
      
      statements.push(declarationNode(token, assignmentNode(equal, variableNode(symbol), valueNode(value))));

      continue;
    }

    throw new Error('not implemented');
  }

  const tree: MainNode = {
    type: NodeType.main,
    children: statements
  };

  return [tree, undefined];

  // let accumulator: Token[] = [];
  // let body: Token[] = [];
  // let context = ParserContext.none;

  // for (const token of tokens) {

  //   if (context === ParserContext.none) {
  //     if (token.type === TokenType.declaration) {
  //       context = ParserContext.declaring;
  //       accumulator.push(token);
  //       continue;
  //     }
  //   }

  //   if (context === ParserContext.declaring) {
  //     accumulator.push(token);
  //   }

  //   if (token.type === TokenType.declaration) {
  //     accumulator.push(token);
  //     context = ParserContext.declaring;
  //     continue;
  //   }
  // }

  // const root = { type: NodeType.statementSequence };

  // const tree = main([
  //   declare('a', 2),
  //   declare('b', 3)
  // ]);

  // return [null, 'not implemented'];
}



function declarationNode(keyword: Token, body: AssignmentNode): DeclarationNode {
  return {
    type: NodeType.declare,
    token: keyword,
    children: [body],
    body
  };
}

function assignmentNode(token: Token, left: VariableNode, right: ValueNode): AssignmentNode {
  return {
    type: NodeType.assign,
    token,
    children: [left, right],
    left,
    right
  };
}

function valueNode(token: Token): ValueNode {
  return {
    type: NodeType.value,
    token,
    children: []
  };
}

function variableNode(token: Token): VariableNode {
  return {
    type: NodeType.variable,
    token,
    children: []
  };
}
