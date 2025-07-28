import 'obsidian';

declare module 'obsidian' {
	interface Component {
		_loaded: boolean;
	}

	interface EventRef {
		ctx?: unknown;
		/**
		 * Emitter of this listener.
		 */
		e: Events;
		fn: (...data: unknown[]) => unknown;
		/**
		 * The event name which this listener registered for.
		 */
		name: string;
	}

	interface Events {
		_: Record<string, EventRef[]>
	}
}