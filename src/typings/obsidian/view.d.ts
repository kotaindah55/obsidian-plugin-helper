import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class DeferredView extends View {}

	/**
	 * @typeonly
	 */
	class EmptyView extends ItemView {
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
		'tag': TagView;
	}
}