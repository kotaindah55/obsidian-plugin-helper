import 'obsidian';

declare module 'obsidian' {
	abstract class AbstractFileTreeItem<T extends TAbstractFile> extends TreeItem implements VirtualItem {
		file: T;
		info: VirtualItemInfo;
		parent?: FolderTreeItem | TreeRoot<FileTreeItem | FolderTreeItem>;
		rendered: boolean;
		view: FileExplorerView;
		constructor(view: FileExplorerView, file: T, el?: HTMLElement);
		abstract getTitle(): string;
		isFullTitleShown(): boolean;
		onRender(): void;
		startRename(): void;
		stopRename(): void;
		updateTitle(): void;
	}

	abstract class CollapsibleFileTreeItem<T extends TAbstractFile> extends AbstractFileTreeItem<T> implements CollapsibleTreeItem {
		childrenEl: HTMLElement;
		collapsed: boolean;
		collapseEl: HTMLElement | null;
		collapsible: boolean;
		onCollapseClick(evt: MouseEvent): void;
		/**
		 * Set collapsed state of the item.
		 * @param animate Animate while it is collapsing or expanding.
		 */
		setCollapsed(collapse: boolean, animate?: boolean): Promise<void> | void;
		setCollapsible(collapsible: boolean): void;
		toggleCollapsed(animate?: boolean): Promise<void> | void;
		updateCollapsed(animate?: boolean): Promise<void>;
	}

	/**
	 * Navigation header component for {@link FileExplorerView | file explorer view}.
	 */
	class FileExplorerNavHeader {
		app: App;
		/**
		 * Navigation header's button container.
		 */
		navButtonsEl: HTMLElement;
		/**
		 * Navigation header's base element.
		 */
		navHeaderEl: HTMLElement;
		constructor(app: App, containerEl: HTMLElement);
		/**
		 * Add a navigation button.
		 */
		addNavButton(
			icon: IconName,
			tooltip: string,
			onClick: (this: HTMLElement, evt: MouseEvent) => unknown,
			cls?: string
		): HTMLElement;
		/**
		 * Add a navigation button, listing all the given sort orders.
		 */
		addSortButton(
			sortOrders: string[][],
			titles: Record<string, () => string>,
			onClick: (orderId: string) => unknown,
			sortOrderGetter: () => string
		): HTMLElement;
	}

	type FileExplorerPlugin = InternalPlugin<'file-explorer'>;

	class FileExplorerPluginInstance implements InternalPluginInstance {}

	type FileExplorerSortOrder =
		| 'alphabetical'
		| 'alphabeticalReverse'
		| 'byModifiedTime'
		| 'byModifiedTimeReverse'
		| 'byCreatedTime'
		| 'byCreatedTimeReverse';

	/**
	 * Represents file explorer view.
	 */
	class FileExplorerView extends View {
		_sortQueued: boolean;
		activeDom: FileTreeItem | FolderTreeItem | null;
		autoRevealFile: boolean;
		fileItems: Record<string, FileTreeItem | FolderTreeItem>;
		files: WeakMap<HTMLElement, TAbstractFile>;
		/**
		 * Navigation header component.
		 */
		headerDom: FileExplorerNavHeader;
		lastDropTargetEl: HTMLElement | null;
		mouseoverExpandTimeout: number | null;
		navFileContainerEl: HTMLElement;
		ready: boolean;
		requestSort: Debouncer<[], void>;
		/**
		 * Current file explorer sort order.
		 */
		sortOrder: string;
		tree: FileExplorerVirtualTree;
		acceptRename(): Promise<void>;
		afterCreate(file?: TAbstractFile, newLeaf?: PaneType | boolean): Promise<void>;
		/**
		 * Attach dragover and drop handler to the given element (it supposes
		 * to be the value of {@link AbstractFileTreeItem.el | `el` property of `AbstractFileTreeItem`}).
		 * 
		 * @param file File or folder that is attached to the tree item.
		 * @param el Element of the tree item.
		 * 
		 * @description The original method only attaches the handler to a folder
		 * tree item only.
		 */
		attachDropHandler(file: TAbstractFile, el: HTMLElement): void;
		createAbstractFile(type: 'file' | 'folder', location: TFolder, newLeaf: PaneType | boolean): Promise<void>;
		displayError(message: string, item: FileTreeItem | FolderTreeItem): void;
		dragFiles(evt: DragEvent, item: FileTreeItem | FolderTreeItem): DraggableFiles | null;
		exitRename(): void;
		getDisplayText(): string;
		getNodeId(item: FileTreeItem | FolderTreeItem): string;
		/**
		 * Get sorted items of the given folder.
		 * 
		 * @param folder 
		 */
		getSortedFolderItems(folder: TFolder): (FileTreeItem | FolderTreeItem)[];
		getViewType(): string;
		isItem(item: FileTreeItem | FolderTreeItem): boolean;
		onConfigChange(confKey: string): void;
		/**
		 * Called after file creation.
		 * 
		 * @param file Newly created file.
		 */
		onCreate(file: TAbstractFile): void;
		onCreateNewFolderClick(evt: MouseEvent): Promise<void>;
		onCreateNewNoteClick(evt: MouseEvent): Promise<void>;
		/**
		 * Called after file deletion.
		 * 
		 * @param file Deleted file.
		 */
		onDelete(file: TAbstractFile): void;
		onDeleteSelectedFiles(evt: Event): Promise<void>;
		onExtensionsUpdated(): void;
		onFileMouseout(evt: MouseEvent, selfEl: HTMLElement): void;
		onFileMouseover(evt: MouseEvent, selfEl: HTMLElement): void;
		onFileOpen(file: TFile): void;
		onFileRenameInput(_evt: KeyboardEvent, innerEl: HTMLElement): void;
		onKeyEnterInRename(evt: KeyboardEvent): void;
		onKeyEscInRename(): void;
		onKeyRename(evt: KeyboardEvent): void;
		/**
		 * Called after modifying a file.
		 */
		onModify(): void;
		/**
		 * Called after renaming a file.
		 * 
		 * @param file Renamed file.
		 */
		onRename(file: TAbstractFile, oldPath: string): void;
		onTitleBlur(): void;
		onToggleAutoReveal(): void;
		openFileContextMenu(evt: Event, fileItemEl: HTMLElement): void;
		revealActiveFile(): void;
		revealInFolder(file: TFile | TFolder): void;
		setAutoReveal(on: boolean): void;
		setIsAllCollapsed(collapsed: boolean): void;
		/**
		 * Set sort order for file explorer.
		 */
		setSortOrder(order: string): void;
		/**
		 * Sort the whole tree with the current order.
		 */
		sort(): void;
		startRenameFile(file?: TAbstractFile): Promise<void>;
		updateShowUnsupportedFiles(): void;
	}

	/**
	 * Tree that is managing all the file and folder tree item, implements
	 * virtual scroll.
	 */
	class FileExplorerVirtualTree extends VirtualTree<FolderTreeItem | FileTreeItem> {
		view: FileExplorerView;
		constructor(view: FileExplorerView, spec: VirtualTreeSpec);
	}

	class FileTreeItem extends AbstractFileTreeItem<TFile> {
		tagEl: HTMLElement | null;
		getTitle(): string;
	}

	class FolderTreeItem extends CollapsibleFileTreeItem<TFolder> implements ParentVirtualItem<FolderTreeItem | FileTreeItem> {
		pusherEl: HTMLElement;
		vChildren: VirtualChildren<this, FolderTreeItem | FileTreeItem>;
		getTitle(): string;
		sort(): void;
	}
}