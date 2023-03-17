/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { AbstractSyntaxTree, DeclarationNode, Node, NodeType } from './parser';

export function emit(tree: AbstractSyntaxTree): string {
  let lines = [];

  for (const child of tree.children) {
    if (ofType<DeclarationNode>(child, NodeType.declare)) {
      lines.push(emitDeclarationNode(child));
      continue;
    }
  }

  return lines.join('\n');
}

function ofType<TNode extends Node>(node: Node, type: NodeType): node is TNode {
  if (node.type === type) {
    return true;
  }
  return false;
}

function emitDeclarationNode(node: DeclarationNode): string {
  return `let ${node.body.left.token.value} = ${node.body.right.token.value};`;
}
