/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import test from 'ava';

import { AbstractSyntaxTree, BinaryNode, EndOfLineNode, FunctionAssignmentNode, FunctionBodyNode, FunctionDeclarationNode, FunctionNode, MainNode, Node, NodeType, ValueNode, VariableNode, parse } from './parser';
import { Token, TokenType, tokenize } from './tokenizer';


test('parser can parse simple assignment', t => {
  const fs = `let x = 5`;

  const [tree, error] = tokenizeAndParse(fs);

  // const expected = main([
  //   declare('x', 5),
  //   endOfLine(),
  // ]);

  const expected = main([
    funcDeclare('x', [], [val(5)]),
    endOfLine()
  ]);

  t.deepEqual(tree, expected);
  t.is(error, undefined);
});

test('parser can parse multiple variable declarations', t => {
  const fs =
    'let a = 2\n'+
    'let b = 3';

  // const expected = main([
  //   declare('a', 2),
  //   endOfLine(),
  //   declare('b', 3),
  //   endOfLine(),
  // ]);

  const expected = main([
    funcDeclare('a', [], [val(2)]),
    endOfLine(),
    funcDeclare('b', [], [val(3)]),
    endOfLine(),
  ]);

  const [tree, error] = tokenizeAndParse(fs);

  t.deepEqual(tree, expected);
  t.is(error, undefined);
});

test('parser can parse function declaration', t => {
  const fs = 'let f x = x + 1';

  const expected = main([
    funcDeclare('f', ['x'], [
      binary(variable('x'), plus(), val(1))
    ]),
    endOfLine(),
  ]);

  const [tree, error] = tokenizeAndParse(fs);

  // console.log('parsed', JSON.stringify(tree, undefined, 2));

  t.deepEqual(tree, expected);
  t.is(error, undefined);
});

test('parser can parse function declaration: one-liner with two parameters', t => {
  const fs = 'let sum a b = a + b';

  const expected = main([
    funcDeclare('sum', ['a', 'b'], [
      binary(variable('a'), plus(), variable('b'))
    ]),
    endOfLine(),
  ]);

  const [tree, error] = tokenizeAndParse(fs);

  t.deepEqual(tree, expected);
  t.is(error, undefined);
});

// test.skip('parser can parse function declaration', t => {
//   // const fs = 'let f x = x + 1';

//   // const expected = main([
//   //   declare('f', )
//   // ]);
// });



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

function plus(): Token {
  return {
    value: '+',
    type: TokenType.plus
  };
}

function main(statements: readonly Node[]): MainNode {
  return {
    type: NodeType.main,
    children: statements
  };
}

function endOfLine(): EndOfLineNode {
  return {
    type: NodeType.endOfLine,
    token: {
      type: TokenType.endOfLine,
      value: '\n'
    },
    children: []
  };
}

// function declare(name: string, value: number): DeclarationNode {
//   const assignmentNode = assign(name, value);
//   return {
//     type: NodeType.declare,
//     token: {
//       value: 'let',
//       type: TokenType.declaration
//     },
//     children: [assignmentNode],
//     body: assignmentNode
//   };
// }

function funcDeclare(name: string, parameters: string[], body: Node[]): FunctionDeclarationNode {
  const assignmentNode = funcAssign(name, parameters, body);
  return {
    type: NodeType.functionDeclare,
    token: {
      value: 'let',
      type: TokenType.declaration
    },
    body: assignmentNode,
    children: [assignmentNode]
  };
}

function binary(left: VariableNode | ValueNode, operator: Token, right: VariableNode | ValueNode): BinaryNode {
  return {
    type: NodeType.binary,
    token: operator,
    left,
    right,
    children: [left, right],
  };
}

function funcAssign(name: string, parameters: string[], body: Node[]): FunctionAssignmentNode {
  const nameAndParamsNode = func(name, parameters);
  const bodyNode = funcBody(body);
  return {
    type: NodeType.functionAssign,
    token: {
      type: TokenType.equal,
      value: '='
    },
    left: nameAndParamsNode,
    right: bodyNode,
    children: [nameAndParamsNode, bodyNode]
  };
}

function funcBody(statements: Node[]): FunctionBodyNode {
  return {
    type: NodeType.functionBody,
    body: statements,
    children: statements
  };
}

function func(name: string, parameters: string[]): FunctionNode {
  const params = parameters.map(param => variable(param));
  return {
    type: NodeType.function,
    token: {
      type: TokenType.symbol,
      value: name,
    },
    parameters: params,
    children: params
  };
}

// function assign(name: string, value: number): AssignmentNode {
//   const variableNode = variable(name);
//   const valueNode = val(value);
//   return {
//     type: NodeType.assign,
//     token: {
//       type: TokenType.equal,
//       value: '='
//     },
//     children: [variableNode, valueNode],
//     left: variableNode,
//     right: valueNode
//   };
// }

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