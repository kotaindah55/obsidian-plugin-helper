import { Component, type EventRef, Events } from 'obsidian';
import type { Except } from 'type-fest';

/**
 * Component that acts as an event emitter, inheriting {@link Events | `Events`}
 * functionality.
 */
export class EmitterComponent extends Component implements Except<Events, '_'> {
	protected readonly emitter: Events;

	constructor() {
		super();
		this.emitter = new Events();
	}

	public on(name: string, callback: (...data: any[]) => unknown, ctx?: unknown): EventRef {
		return this.emitter.on(name, callback, ctx);
	}

	public off(name: string, callback: (...data: unknown[]) => unknown): void {
		return this.emitter.off(name, callback);
	}

	public offref(ref: EventRef): void {
		return this.emitter.offref(ref);
	}

	public trigger(name: string, ...data: unknown[]): void {
		return this.emitter.trigger(name, ...data);
	}

	public tryTrigger(evt: EventRef, args: unknown[]): void {
		return this.emitter.tryTrigger(evt, args);
	}

	/**
	 * Similiar to {@link on | `on()`}, but the handler will be detached
	 * after the first call.
	 */
	public once(name: string, callback: (...data: any[]) => unknown, ctx?: unknown): void {
		let ref = this.on(name, (...data) => {
			callback.apply(ctx, data);
			this.offref(ref);
		}, ctx);
	}
}


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