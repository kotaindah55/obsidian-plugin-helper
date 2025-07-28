import 'obsidian';

declare module 'obsidian' {
	interface RibbonItem {
		buttonEl?: HTMLElement;
		callback: () => unknown;
		hidden: boolean;
		icon: IconName;
		id: string;
		title: string;
	}
}