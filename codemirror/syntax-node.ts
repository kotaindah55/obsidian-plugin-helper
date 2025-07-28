import { tokenClassNodeProp } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';

/**
 * Look behind the given reference {@link refNode | node} until reach the
 * target node with specified {@link target | name}.
 * 
 * @param refNode {@link SyntaxNode} as a starting point.
 * @param target Name of the targeted node.
 * @param limit Iteration limit, default to 100.
 */
export function lookBehindNode(
	refNode: SyntaxNode,
	target: string,
	limit = 100
): SyntaxNode | null {
	let targetNode: SyntaxNode | null = null;
	do {
		if (targetNode?.type.prop(tokenClassNodeProp)?.split(' ').includes(target)) break;
		targetNode = refNode.prevSibling;
		limit--;
	} while (targetNode && limit > 0);
	return targetNode;
}