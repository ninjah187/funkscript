/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import test from 'ava';

import { AbstractSyntaxTree, AssignmentNode, DeclarationNode, MainNode, Node, NodeType, ValueNode, VariableNode, parse } from './parser';
import { Token, TokenType, tokenize } from './tokenizer';


test('parser can parse simple assignment', t => {
  const fs = `let x = 5`;

  const [tree, error] = tokenizeAndParse(fs);

  const expected = main([
    declare('x', 5)
  ]);

  t.deepEqual(tree, expected);
  t.is(error, undefined);
});

test('parser can parse multiple variable declarations', t => {
  const fs =
    'let a = 2\n'+
    'let b = 3';

  const expected = main([
    declare('a', 2),
    declare('b', 3)
  ]);

  const [tree, error] = tokenizeAndParse(fs);

  // console.log('parsed', JSON.stringify(tree, undefined, 2));

  t.deepEqual(tree, expected);
  t.is(error, undefined);
});

// test('parser can parse multi line statements', t => {
//   const fs = `
//     let sum a b = a + b

//     let a = 2
//     let b = 3

//     print sum a b
//   `;
// });

// test('parser can parse pipe operator', t => {
//   const fs = `
//     let increment x = x + 1

//     print 0 |> increment
//   `;
// });


function tokenizeAndParse(input: string): readonly [AbstractSyntaxTree, string] {
  const tokens = tokenize(input) as Token[];
  return parse(tokens);
}

// // type Node = {
// //   type: NodeType;
// // };

// // type StatementSequenceNode = Node | {
// //   children: Node[]
// // };

// // type BinaryNode = Node | {
// //   left: Node;
// //   right: Node;
// // };

// class Node {
//   constructor(public readonly type: NodeType) {}
// }



// enum NodeType {

// }


function main(statements: readonly Node[]): MainNode {
  return {
    type: NodeType.main,
    children: statements
  };
}

function declare(name: string, value: number): DeclarationNode {
  const assignmentNode = assign(name, value);
  return {
    type: NodeType.declare,
    token: {
      value: 'let',
      type: TokenType.declaration
    },
    children: [assignmentNode],
    body: assignmentNode
  };
}

function assign(name: string, value: number): AssignmentNode {
  const variableNode = variable(name);
  const valueNode = val(value);
  return {
    type: NodeType.assign,
    token: {
      type: TokenType.equal,
      value: '='
    },
    children: [variableNode, valueNode],
    left: variableNode,
    right: valueNode
  };
}

function variable(name: string): VariableNode {
  return {
    type: NodeType.variable,
    token: {
      type: TokenType.symbol,
      value: name
    },
    children: []
  };
}

function val(value: number): ValueNode {
  return {
    type: NodeType.value,
    token: {
      type: TokenType.literal,
      value: '' + value
    },
    children: []
  };
}