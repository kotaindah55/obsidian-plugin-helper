import { App, Component, type EventRef, Modal } from 'obsidian';

export class EventTargetModal extends Modal {
	public readonly registrar: Component;
	public isOpen: boolean;

	constructor(app: App) {
		super(app);
		this.registrar = new Component();
		this.isOpen = false;
	}

	public open(): void {
		super.open();
		this.isOpen = true;
		this.registrar.load();
	}

	public close(): void {
		super.close();
		this.isOpen = false;
		this.registrar.unload();
	}

	public addChild<T extends Component>(child: T): T {
		return this.registrar.addChild(child);
	}

	public removeChild<T extends Component>(child: T): T {
		return this.registrar.removeChild(child);
	}

	public register(callback: () => unknown): void {
		this.registrar.register(callback);
	}

	public registerEvent(ref: EventRef): void {
		this.registrar.registerEvent(ref);
	}

	public registerInterval(id: number): number {
		return this.registrar.registerInterval(id);
	}

	public registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: Window, evt: WindowEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): void;
	public registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (this: Document, evt: DocumentEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): void;
	public registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, evt: HTMLElementEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): void;
	public registerDomEvent(
		el: EventTarget,
		type: string,
		callback: (this: typeof el, evt: Event) => unknown,
		options?: boolean | AddEventListenerOptions
	): void {
		this.registrar.registerDomEvent(
			el as HTMLElement,
			type as keyof HTMLElementEventMap,
			callback,
			options
		);
	}
}