import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class DeferredView extends View {
		getDisplayText(): string;
		getViewType(): string;
}

	/**
	 * @typeonly
	 */
	class EmptyView extends ItemView {
		getDisplayText(): string;
		getViewType(): 'empty';
	}

	interface MarkdownView {
		metadataEditor: MetadataEditor;
		setMode(mode: MarkdownEditView | MarkdownPreviewView): Promise<boolean>;
	}

	type TypedViewCreator<T extends View> = (leaf: WorkspaceLeaf) => T;

	interface View {
		close(): Promise<void>;
	}

	interface ViewState {
		icon: string;
	}

	interface ViewTypeMap {
		'all-properties': AllPropertiesView;
		'bookmarks': BookmarksView;
		'empty': EmptyView;
		'file-properties': FilePropertiesView;
		'file-explorer': FileExplorerView;
		'search': GlobalSearchView;
		'tag': TagView;
	}
}