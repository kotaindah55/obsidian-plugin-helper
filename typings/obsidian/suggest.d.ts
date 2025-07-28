import 'obsidian';

declare module 'obsidian' {
	interface AbstractInputSuggest<T> {
		textInputEl: HTMLDivElement | HTMLInputElement;
	}

	interface EditorSuggest<T> {
		trigger(editor: Editor, file: TFile | null, isUserInput: boolean): boolean;
	}

	/**
	 * @typeonly
	 */
	class EditorSuggestManager {
		suggests: [WikilinkSuggest, TagSuggest, ...EditorSuggest<unknown>[]];
		setCurrentSuggest(suggest: EditorSuggest<unknown>): void;
		trigger(editor: Editor, file: TFile | null, isUserInput: boolean): boolean;
	}

	interface PopoverSuggest<T> {
		autoDestroy?: () => void;
		isOpen: boolean;
		suggestEl: HTMLElement;
		suggestions: SuggestSource<T, this>;
	}

	interface SuggestResult {
		match: SearchResult | null;
	}

	/**
	 * @typeonly
	 */
	class SuggestSource<T, S extends PopoverSuggest<T>> {
		chooser: S;
		selectedItem: number;
		values: T[] | null;
		setSuggestions(values: T[] | null): void;
	}

	/**
	 * @typeonly
	 */
	class TagSuggest extends EditorSuggest<TagSuggestResult> {}

	interface TagSuggestResult extends SuggestResult {
		tag: string;
	}

	/**
	 * @typeonly
	 */
	class WikilinkSuggest extends EditorSuggest<WikilinkSuggestResult> {}

	interface WikilinkSuggestResult extends SuggestResult {
		type: 'file' | 'alias' | 'block' | 'none' | 'heading';
		file?: TFile;
		path?: string;
	}
}