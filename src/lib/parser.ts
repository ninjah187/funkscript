/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { Token, TokenType } from './tokenizer';

export type AbstractSyntaxTree = Node;

export type Node = {
  readonly type: NodeType,
  readonly children: readonly Node[]
};

export type MainNode = Node;

export type EndOfLineNode = Node & {
  readonly token: Token;
};

export type DeclarationNode = Node & {
  readonly token: Token;
  readonly body: AssignmentNode;
};

export type BinaryNode = Node & {
  readonly token: Token;
  readonly left: Node;
  readonly right: Node;
};

export type FunctionDeclarationNode = Node & {
  readonly token: Token;
  readonly body: FunctionAssignmentNode;
};

export type AssignmentNode = Node & {
  readonly token: Token;
  readonly left: VariableNode;
  readonly right: ValueNode;
};

export type FunctionAssignmentNode = Node & {
  readonly token: Token;
  readonly left: FunctionNode;
  readonly right: FunctionBodyNode;
};

export type FunctionNode = Node & {
  readonly token: Token;
  readonly parameters: VariableNode[]; // declare ParameterNode ?
};

export type FunctionBodyNode = Node & {
  readonly body: Node[];
};

export type VariableNode = Node & {
  readonly token: Token;
};

export type ValueNode = Node & {
  readonly token: Token;
};

export enum NodeType {
  main = 'main',
  binary = 'binary',
  declare = 'declare',
  assign = 'assign',
  endOfLine = 'endOfLine',
  variable = 'variable',
  value = 'value',
  function = 'function',
  functionBody = 'functionBody',
  functionAssign = 'functionAssign',
  functionDeclare = 'functionDeclare',
}

export type CompilationError = string;

export function parse(tokens: Token[]): readonly [AbstractSyntaxTree, CompilationError] {
  let context = ParserContext.none;

  let left: Token[] = [];
  let equal: Token;
  let right: Token[] = [];

  tokens = [...tokens];

  const statements: Node[] = [];

  while (tokens.length !== 0) {
    const token = tokens.shift();

    if (context === ParserContext.none) {
      if (token.type === TokenType.declaration) {
        context = ParserContext.declaration;
        left.push(token);
        continue;
      }
    }

    if (context === ParserContext.declaration) {
      if (token.type === TokenType.symbol) {
        left.push(token);
        continue;
      }

      if (token.type === TokenType.equal) {
        context = ParserContext.assignment;
        equal = token;
        continue;
      }

      left.push(token);
      continue;
    }

    if (context === ParserContext.assignment) {
      if (token.type === TokenType.endOfLine) {
        context = ParserContext.none;

        statements.push(parseFunctionDeclaration(left, equal, right));
        statements.push(endOfLineNode(token));

        left.length = 0;
        equal = undefined;
        right.length = 0;

        continue;
      }

      right.push(token);
      continue;
    }

    if (token.type === TokenType.endOfLine) {
      statements.push(endOfLineNode(token));
      continue;
    }

    throw new Error(`Cannot parse token: ${JSON.stringify(token)}`);
  }

  const tree: MainNode = {
    type: NodeType.main,
    children: statements
  };

  return [tree, undefined];
}

enum ParserContext {
  none = 'none',
  declaration = 'declaration',
  assignment = 'assignment',
}

function parseFunctionBody(tokens: Token[]): FunctionBodyNode {

  if (tokens.length === 1) {
    const [token] = tokens;
    
    if (token.type === TokenType.literal) {
      return functionBodyNode([valueNode(token)]);
    }
  }

  let left: Token[] = [];
  let operator: Token;
  let right: Token[] = [];

  for (const token of tokens) {
    if (operator === undefined) {
      if (token.type === TokenType.plus) {
        operator = token;
      } else {
        left.push(token);
      }
    } else {
      right.push(token);
    }
  }

  return functionBodyNode([binaryNode(variableOrValueNode(left.shift()), operator, variableOrValueNode(right.shift()))]);
}

function endOfLineNode(token: Token): EndOfLineNode {
  return {
    type: NodeType.endOfLine,
    token,
    children: []
  };
}

function parseFunctionDeclaration(left: Token[], equal: Token, right: Token[]): FunctionDeclarationNode {
  const [keyword, variable, ...parameters] = left;
  const assignmentNode = functionAssignmentNode(variable, parameters, equal, right);
  return functionDeclarationNode(keyword, assignmentNode);
}

function functionDeclarationNode(keyword: Token, body: FunctionAssignmentNode): FunctionDeclarationNode {
  return {
    type: NodeType.functionDeclare,
    token: keyword,
    body,
    children: [body]
  };
}

function functionAssignmentNode(variable: Token, parameters: Token[], equal: Token, body: Token[]): FunctionAssignmentNode {
  const nameAndParamsNode = functionNode(variable, parameters);
  const bodyNode = parseFunctionBody(body);
  return {
    type: NodeType.functionAssign,
    token: equal,
    left: nameAndParamsNode,
    right: bodyNode,
    children: [nameAndParamsNode, bodyNode]
  };
}

// function declarationNode(keyword: Token, body: AssignmentNode): DeclarationNode {
//   return {
//     type: NodeType.declare,
//     token: keyword,
//     children: [body],
//     body
//   };
// }

// function assignmentNode(token: Token, left: VariableNode, right: ValueNode): AssignmentNode {
//   return {
//     type: NodeType.assign,
//     token,
//     children: [left, right],
//     left,
//     right
//   };
// }

function functionNode(variable: Token, parameters: Token[]): FunctionNode {
  const params = parameters.map(param => variableNode(param));
  return {
    type: NodeType.function, // rename to FunctionSignatureNode ?
    token: variable,
    parameters: params,
    children: params
  };
}

function functionBodyNode(node: Node[]): FunctionBodyNode {
  return {
    type: NodeType.functionBody,
    body: node,
    children: node,
  };
}

function binaryNode(left: VariableNode | ValueNode, operator: Token, right: VariableNode | ValueNode): BinaryNode {
  return {
    type: NodeType.binary,
    token: operator,
    left,
    right,
    children: [left, right],
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

function variableOrValueNode(token: Token): VariableNode | ValueNode {
  if (token.type === TokenType.symbol) {
    return variableNode(token);
  }

  if (token.type === TokenType.literal) {
    return valueNode(token);
  }

  throw new Error(`Cannot parse token: ${JSON.stringify(token)}`);
}