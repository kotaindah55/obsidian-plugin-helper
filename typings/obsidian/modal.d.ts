import 'obsidian';

declare module 'obsidian' {
	interface Modal {
		bgOpacity: string;
		dimBackground: boolean;
		win: Window;
		setBackgroundOpacity(CSSOpacity: string): this;
		setDimBackground(on: boolean): this;
	}
}