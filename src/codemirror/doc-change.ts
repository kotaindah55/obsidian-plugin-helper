import { Transaction, type ChangeDesc } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';

export interface ChangedRange {
	from: number;
	toA: number;
	toB: number;
	length: number;
}

/**
 * Merged changes held by {@link ChangeDesc} into {@link ChangedRange}
 * @returns Returns null if the {@link changes} were empty.
 */
export function mergeChanges(changes: ChangeDesc): ChangedRange | null {
	if (changes.empty) return null;

	let from: number,
		toA: number,
		toB: number;

	// Get the changed range.
	changes.iterChangedRanges((fromA, toA_2, _, toB_2) => {
		from = from === undefined ? fromA : Math.min(from, fromA);
		toA = toA === undefined ? toA_2 : Math.max(toA, toA_2);
		toB = toB === undefined ? toB_2 : Math.max(toB, toB_2);
	}, false);

	return {
		from: from!,
		toA: toA!,
		toB: toB!,
		length: toB! - toA!
	};
}

export function isUserInput(viewUpdate: ViewUpdate): boolean {
	let { transactions, docChanged } = viewUpdate;

	return (
		docChanged &&
		transactions.some(tr => tr.annotation(Transaction.userEvent) !== 'set') &&
		transactions.some(tr => tr.isUserEvent('input') || tr.isUserEvent('delete'))
	);
}