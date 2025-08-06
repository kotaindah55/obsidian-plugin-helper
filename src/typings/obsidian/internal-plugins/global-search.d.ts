import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class FileMatchTreeItem implements VirtualItem {
		el: HTMLElement;
		info: VirtualItemInfo;
		onRender?: (() => void) | undefined;
	}

	interface GlobalSearchInfinityScroll extends InfinityScroll<GlobalSearchResultTreeItem> {
		rootEl?: GlobalSearchTreeRoot;
	}

	type GlobalSearchPlugin = InternalPlugin<'global-search'>;

	/**
	 * @typeonly
	 */
	class GlobalSearchPluginInstance implements InternalPluginInstance {}

	interface GlobalSearchResult {
		[key: string]: SearchResult;
	}

	/**
	 * @typeonly
	 */
	class GlobalSearchResultTreeItem implements ParentVirtualItem<FileMatchTreeItem>, Partial<CollapsibleTreeItem> {
		childrenEl: HTMLElement;
		collapsed: boolean;
		collapseEl: HTMLElement | null;
		collapsible: boolean;
		el: HTMLElement;
		file: TFile;
		info: VirtualItemInfo;
		onRender?: (() => void) | undefined;
		pusherEl: HTMLElement;
		vChildren: VirtualChildren<this, FileMatchTreeItem>;
		onCollapseClick(evt: MouseEvent): void;
		setCollapsed(collapse: boolean, animate?: boolean): Promise<void> | void;
		setCollapsible(collapsible: boolean): void;
	}

	/**
	 * @typeonly
	 */
	class GlobalSearchTreeRoot implements TreeRoot<GlobalSearchResultTreeItem> {
		childrenEl: HTMLElement;
		el: HTMLElement;
		info: VirtualItemInfo;
		pusherEl: HTMLElement;
		resultDomLookup: Map<TFile, GlobalSearchResultTreeItem>;
		vChildren: VirtualChildren<this, GlobalSearchResultTreeItem>;
		addResult(file: TFile | null, result: GlobalSearchResult, content: string, showTitle?: boolean): GlobalSearchResultTreeItem | void;
	}

	/**
	 * @typeonly
	 */
	class GlobalSearchView extends View {
		getDisplayText(): string;
		getViewType(): 'search';
	}
}