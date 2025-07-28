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
	}

	type FileSuggestResult =
		| FileSuggestResultAlias
		| FileSuggestResultBookmark
		| FileSuggestResultFile
		| FileSuggestResultUnresolved;
	
	interface FileSuggestResultAlias extends AbstractFileSuggestResultAbstract<'alias'> {
		alias: string;
		downranked: boolean;
		file: TFile;
	}

	interface FileSuggestResultBookmark extends AbstractFileSuggestResultAbstract<'bookmark'> {
		bookmarkPath: string;
		item: BookmarkItem;
	}

	interface FileSuggestResultFile extends AbstractFileSuggestResultAbstract<'file'> {
		downranked?: boolean;
		file: TFile | null;
	}

	interface FileSuggestResultUnresolved extends AbstractFileSuggestResultAbstract<'unresolved'> {
		linktext: string;
	}
}