import type { EventRef } from 'obsidian';

/**
 * Place the event handler at the highest precedence, so it will be
 * called first once the corresponding event is emitted
 */
export function prioritize(ref: EventRef): EventRef {
	let emitter = ref.e,
		refs = emitter._[ref.name],
		index = refs?.indexOf(ref);
	
	// Do nothing if this listener has been detached.
	if (index === undefined || index < 0) return ref;

	refs.splice(index, 1);
	refs.unshift(ref);
	return ref;
}