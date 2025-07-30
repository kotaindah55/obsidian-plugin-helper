import 'obsidian';

declare module 'obsidian' {
	interface AbstractBookmarkItem<T extends string> {
		ctime: number;
		title: string | undefined;
		type: T;
	}

	/**
	 * @typeonly
	 */
	abstract class AbstractBookmarkTreeItem<T extends BookmarkItem> extends TreeItem {
		item: T;
		view: BookmarksView;
		startRename(): void;
	}

	/**
	 * @typeonly
	 */
	class BookmarkGroupTreeItem extends CollapsibleBookmarkTreeItem<BookmarkItemGroup> implements ParentVirtualItem<BookmarkTreeItem | BookmarkGroupTreeItem> {
		info: VirtualItemInfo;
		onRender?: () => void;
		parent: BookmarkGroupTreeItem | TreeRoot<BookmarkTreeItem | BookmarkGroupTreeItem>;
		pusherEl: HTMLElement;
		vChildren: VirtualChildren<this, BookmarkTreeItem | BookmarkGroupTreeItem>;
	}

	type BookmarkItem =
		| BookmarkItemFile
		| BookmarkItemFolder
		| BookmarkItemGraph
		| BookmarkItemGroup
		| BookmarkItemSearch
		| BookmarkItemUrl;

	interface BookmarkItemFile extends AbstractBookmarkItem<'file'> {
		path: string;
	}

	interface BookmarkItemFolder extends AbstractBookmarkItem<'folder'> {
		path: string;
	}

	interface BookmarkItemGraph extends AbstractBookmarkItem<'graph'> {
		options: Record<string, unknown>;
	}

	interface BookmarkItemGroup extends AbstractBookmarkItem<'group'> {
		items: BookmarkItem[];
	}

	interface BookmarkItemSearch extends AbstractBookmarkItem<'search'> {
		query: string;
	}

	interface BookmarkItemUrl extends AbstractBookmarkItem<'url'> {
		url: string;
	}

	type BookmarksPlugin = InternalPlugin<'bookmarks'>;

	/**
	 * @typeonly
	 */
	class BookmarksPluginInstance extends Events implements InternalPluginInstance {
		bookmarkLookup: Record<string, BookmarkItemFile | BookmarkItemFolder>;
		items: BookmarkItem[];
		urlBookmarkLookup: Record<string, BookmarkItemUrl>;
		addItem(item: BookmarkItem, group?: BookmarkItemGroup): void;
		getBookmarks(): BookmarkItem[];
		removeItem(item: BookmarkItem): void;
		saveData(): void;
	}

	type BookmarkType =
		| 'file'
		| 'folder'
		| 'graph'
		| 'group'
		| 'search'
		| 'url';

	/**
	 * @typeonly
	 */
	class BookmarksView extends ItemView {
		getViewType(): string;
		getDisplayText(): string;
		itemDoms: WeakMap<BookmarkItem, BookmarkTreeItem | BookmarkGroupTreeItem>;
		plugin: BookmarksPluginInstance;
		tree: BookmarksVirtualTree;
		get root(): this['tree']['root'];
		createNewGroup(parent?: BookmarkItemGroup): void;
		getItemDom<T extends BookmarkItem>(item: T): T extends BookmarkItemGroup ? BookmarkGroupTreeItem : BookmarkTreeItem;
		update(): void;
	}

	interface BookmarksVirtualTree extends VirtualTree<BookmarkTreeItem | BookmarkGroupTreeItem> {
		view: BookmarksView;
	}

	/**
	 * @typeonly
	 */
	class BookmarkTreeItem extends AbstractBookmarkTreeItem<Exclude<BookmarkItem, BookmarkItemGroup>> implements VirtualItem {
		iconEl: HTMLElement;
		info: VirtualItemInfo;
		onRender?: () => void;
		parent: BookmarkGroupTreeItem | TreeRoot<BookmarkTreeItem | BookmarkGroupTreeItem>;
	}

	/**
	 * @typeonly
	 */
	abstract class CollapsibleBookmarkTreeItem<T extends BookmarkItem> extends AbstractBookmarkTreeItem<T> implements CollapsibleTreeItem {
		childrenEl: HTMLElement;
		collapsed: boolean;
		collapseEl: HTMLElement | null;
		collapsible: boolean;
		onCollapseClick(evt: MouseEvent): void;
		setCollapsed(collapse: boolean, animate?: boolean): Promise<void> | void;
		setCollapsible(collapsible: boolean): void;
		toggleCollapsed(animate?: boolean): Promise<void> | void;
		updateCollapsed(animate?: boolean): Promise<void>;
	}
}