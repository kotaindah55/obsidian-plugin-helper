import 'obsidian';

declare module 'obsidian' {	
	interface AbstractFileSuggestResult<T extends string> extends SuggestResult {
		type: T;
	}

	/**
	 * @typeonly
	 */
	class FileSuggestModal extends SuggestModal<FileSuggestResult | null> {
		get supportsCreate(): boolean;
		getSuggestions(query: string): (FileSuggestResult | null)[] | Promise<(FileSuggestResult | null)[]>;
		renderSuggestion(value: FileSuggestResult | null, el: HTMLElement): void;
		onChooseSuggestion(item: FileSuggestResult | null, evt: MouseEvent | KeyboardEvent): void;
	}

	type FileSuggestResult =
		| FileSuggestResultAlias
		| FileSuggestResultBookmark
		| FileSuggestResultFile
		| FileSuggestResultUnresolved;
	
	interface FileSuggestResultAlias extends AbstractFileSuggestResult<'alias'> {
		alias: string;
		downranked: boolean;
		file: TFile;
	}

	interface FileSuggestResultBookmark extends AbstractFileSuggestResult<'bookmark'> {
		bookmarkPath: string;
		item: BookmarkItem;
	}

	interface FileSuggestResultFile extends AbstractFileSuggestResult<'file'> {
		downranked?: boolean;
		file: TFile | null;
	}

	interface FileSuggestResultUnresolved extends AbstractFileSuggestResult<'unresolved'> {
		linktext: string;
	}
}