import 'obsidian';
import type { EditorView } from '@codemirror/view';

declare module 'obsidian' {
	interface Editor {
		/**
		 * Main CodeMirror's `EditorView` instance of the editor.
		 */
		cm: EditorView;
		editorComponent: MarkdownEditView;
		/**
		 * Currently active `EditorView` in the editor, either belongs to the
		 * main editor directly or to the table cell.
		 */
		get activeCM(): EditorView;
		/**
		 * Whether the main editor has a nested `EditorView` inside a table cell.
		 */
		get inTableCell(): boolean;
		addHighlights(
			ranges: EditorRange[],
			style: 'is-flashing' | 'obsidian-search-match-highlight',
			removePrev: boolean,
			range?: EditorSelection
		): void;
	}
}