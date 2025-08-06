import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	abstract class AbstractDocumentSearch {
		app: App;
		abstract findNext(): void;
		abstract findPrevious(): void;
		abstract hide(): void;
		abstract show(): void;
	}

	/**
	 * @typeonly
	 */
	class EditorSearch extends AbstractDocumentSearch {
		findNext(): void;
		findPrevious(): void;
		hide(): void;
		show(replace?: boolean): void;
	}
}