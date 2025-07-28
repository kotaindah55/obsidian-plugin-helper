import type { CapacitorGlobal } from '@capacitor/core';
import type { BaseWindow } from 'electron';
import type i18next_instance from 'i18next';
import type FontList from 'font-list';

declare global {
	var i18next: typeof i18next_instance;
	var electronWindow: BaseWindow;
	var Capacitor: CapacitorGlobal;

	interface Class<T, Args extends unknown[] = any[]> {
		new (...args: Args): T;
		prototype: T;
	}

	type ClassType<T extends Instance> = T['constructor'];

	interface Instance<T = this, Args extends unknown[] = any[]> {
		constructor: Class<T, Args>;
	}

	interface HTMLElement {
		addEventListeners<K extends keyof HTMLElementEventMap>(listenerRecord: {
			[Key in K]?: (this: this, evt: HTMLElementEventMap[K]) => unknown
		}): void;
	}
	
	interface Window {
		electronWindow: BaseWindow;
	}

	declare namespace NodeJS {
		interface Require {
			(id: 'font-list'): typeof FontList;
		}
	}
}