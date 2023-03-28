/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { AbstractSyntaxTree, BinaryNode, DeclarationNode, FunctionDeclarationNode, Node, NodeType, ValueNode, VariableNode } from './parser';

export function emit(tree: AbstractSyntaxTree): string {
  let lines = [];

  for (const child of tree.children) {
    if (ofType<DeclarationNode>(child, NodeType.declare)) {
      lines.push(emitDeclarationNode(child));
      continue;
    }

    if (ofType<FunctionDeclarationNode>(child, NodeType.functionDeclare)) {
      lines.push(...emitFunctionDeclarationNode(child));
      continue;      
    }
  }

  return lines.join('\n');
}

function ofType<TNode extends Node>(node: Node, type: NodeType): node is TNode {
  return node.type === type;
}

function emitDeclarationNode(node: DeclarationNode): string {
  return `let ${node.body.left.token.value} = ${node.body.right.token.value};`;
}

function* emitFunctionDeclarationNode(node: FunctionDeclarationNode): IterableIterator<string> {
  yield `function ${node.body.left.token.value}(${node.body.left.parameters.map(variable => variable.token.value).join(', ')}) {`;

  if (node.body.right.children.length === 1) {
    const [statement] = node.body.right.children;
    
    if (ofType<ValueNode>(statement, NodeType.value)) {
      yield `  return ${statement.token.value};`;
    } else if (ofType<BinaryNode>(statement, NodeType.binary)) {
      yield `  return ${emitVariableOrValue(statement.left)} ${statement.token.value} ${emitVariableOrValue(statement.right)};`;
    } else {
      throw new Error(`Cannot emit node: ${JSON.stringify(statement)}`);
    }
  } else {
    throw new Error(`Cannot emit node: ${JSON.stringify(node)}`);
  }

  yield '}';
}

function emitVariableOrValue(node: Node): string {
  if (ofType<VariableNode>(node, NodeType.variable)) {
    return node.token.value;
  }

  if (ofType<ValueNode>(node, NodeType.value)) {
    return node.token.value;
  }

  throw new Error(`Cannot emit node as variable or value: ${JSON.stringify(node)}`);
}