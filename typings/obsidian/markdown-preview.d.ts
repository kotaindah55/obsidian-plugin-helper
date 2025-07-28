import 'obsidian';

declare module 'obsidian' {
	interface MarkdownPostProcessorContext {
		containerEl: HTMLElement;
	}

	interface MarkdownPreviewRenderer {
		sections: MarkdownPreviewSection[];
		applyScroll(line: number, option?: { highlight?: boolean, center?: boolean }): boolean;
		onRendered(callback: () => unknown): void;
	}

	interface MarkdownPreviewSection {
		lineEnd: number;
		lineStart: number;
	}

	interface MarkdownPreviewView {
		renderer: MarkdownPreviewRenderer;
	}
}