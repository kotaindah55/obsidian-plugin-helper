import type { ParentVirtualItem, VirtualItem, VirtualTree } from 'obsidian';

/**
 * Traverse all {@link VirtualItem | tree items} in the given tree
 * using pre-order traversal.
 */
export function iterateTreeNode<
	I extends VirtualItem | ParentVirtualItem<I>
>(tree: VirtualTree<I>, cb: (item: I) => unknown): void {
	let root = tree.root;
	if (!root) return;

	let treePath: ParentVirtualItem<I>[] = [root],
		indexes = [0];

	for (let deep = 0;;) {
		let parent = treePath[deep],
			children = parent.vChildren._children,
			item = children[indexes[deep]];

		if (!item) {
			if (!deep) break;
			deep--;
			treePath.pop();
			indexes.pop();
			indexes[deep]++;
			continue;
		}

		cb(item);

		if ('vChildren' in item) {
			treePath.push(item);
			indexes.push(0);
			deep++;
		} else {
			indexes[deep]++;
		}
	}
}

/**
 * Traverse all {@link VirtualItem | tree items} in the given tree
 * asynchronously using pre-order traversal.
 */
export async function iterateTreeNodeAsync<
	I extends VirtualItem | ParentVirtualItem<I>
>(tree: VirtualTree<I>, cb: (item: I) => Promise<unknown>): Promise<void> {
	let root = tree.root;
	if (!root) return;

	let treePath: ParentVirtualItem<I>[] = [root],
		indexes = [0];

	for (let deep = 0;;) {
		let parent = treePath[deep],
			children = parent.vChildren._children,
			item = children[indexes[deep]];

		if (!item) {
			if (!deep) break;
			deep--;
			treePath.pop();
			indexes.pop();
			indexes[deep]++;
			continue;
		}

		await cb(item);

		if ('vChildren' in item) {
			treePath.push(item);
			indexes.push(0);
			deep++;
		} else {
			indexes[deep]++;
		}
	}
}