import 'obsidian';

declare module 'obsidian' {
	interface CollapsibleTreeItem extends TreeItem {
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

	/**
	 * @typeonly
	 */
	class InfinityScroll<Item extends VirtualItem> {
		height: number;
		lastScroll: number;
		queued: TaskQueue | null;
		renderBlockSize: number;
		rootEl?: TreeRoot<Item>;
		rtl: boolean;
		scrollEl: HTMLElement;
		setWidth: boolean;
		width: number;
		constructor(scrollEl: HTMLElement);
		compute(maxLimit?: boolean): void;
		findElementTop(item: Item, parent: ParentVirtualItem<Item>, parentTop: number): number | null;
		getRootTop(): number;
		invalidate(item: Item, subtree?: boolean): void;
		invalidateAll(): void;
		measure(parent: ParentVirtualItem<Item>, item: Item): void;
		onResize(): void;
		onScroll(): void;
		queueCompute(): void;
		scrollIntoView(item: Item, margin: number): void;
		update(
			item: Item,
			rootTop: number,
			minComputedRange: number,
			maxComputedRange: number,
			paddingInlineStart: number,
			avarageItemHeight: number
		): void;
		updateVirtualDisplay(top: number): void;
		_layout(item: Item, state: InfinityScrollComputeState): boolean;
		_measure(item: Item): void;
		_precompute(item: Item): boolean;
	}

	interface InfinityScrollComputeState {
		limit: number;
		num: number;
		finished: boolean;
	}

	interface ParentVirtualItem<Item extends VirtualItem> extends VirtualItem {
		childrenEl: HTMLElement;
		pusherEl: HTMLElement;
		vChildren: VirtualChildren<this, Item>;
	}

	/**
	 * @typeonly
	 */
	class TreeItem implements TreeNode {
		coverEl: HTMLElement;
		el: HTMLElement;
		innerEl: HTMLElement;
		selfEl: HTMLElement;
		constructor(el?: HTMLElement);
		onSelfClick(evt: MouseEvent | KeyboardEvent): void;
		setClickable(on: boolean): void;
	}

	interface TreeNode {
		el: HTMLElement;
	}

	/**
	 * @typeonly
	 */
	class TreeRoot<Item extends VirtualItem> implements ParentVirtualItem<Item> {
		childrenEl: HTMLElement;
		el: HTMLElement;
		info: VirtualItemInfo;
		pusherEl: HTMLElement;
		vChildren: VirtualChildren<this, Item>;
		constructor(el: HTMLElement);
	}

	/**
	 * @typeonly
	 */
	class VirtualChildren<Owner extends ParentVirtualItem<Item>, Item extends VirtualItem> {
		owner: Owner;
		_children: Item[];
		get children(): Item[];
		constructor(owner: Owner);
		addChild(item: Item): void;
		clear(): void;
		first(): Item | undefined;
		hasChildren(): boolean;
		last(): Item | undefined;
		removeChild(item: Item): void;
		setChildren(items: Item[]): void;
		size(): number;
		sort(compareFn?: (a: Item, b: Item) => number): Item[];
	}

	interface VirtualItem extends TreeNode {
		info: VirtualItemInfo;
		onRender?: () => void;
	}

	interface VirtualItemInfo {
		childLeft: number;
		childLeftPadding: number;
		childTop: number;
		computed: boolean;
		height: number;
		hidden: boolean;
		next: boolean;
		queued: boolean;
		width: number;
	}

	/**
	 * @typeonly
	 */
	class VirtualTree<Item extends VirtualItem> {
		activeDom: null | Item;
		app: App;
		containerEl: HTMLElement;
		focusedItem: null | Item;
		getNodeId: (item: Item) => string;
		handleCollapseAll: () => unknown;
		handleDeleteSelectedItems: () => unknown;
		handleRenameFocusedItem: () => unknown;
		id: string;
		infinityScroll: InfinityScroll<Item>;
		isAllCollapsed: boolean;
		prefersCollapsed: boolean;
		requestSaveFolds: Debouncer<[], void>;
		scope: Scope;
		selectedDoms: Set<Item>;
		view: View;
		get root(): this['infinityScroll']['rootEl'];
		constructor(view: View, spec: VirtualTreeSpec<Item>);
		changeFocusedItem(direction: 'forwards' | 'backwards'): void;
		clearSelectedDoms(): void;
		deselectItem(item: Item): void;
		getFoldKey(): string;
		handleItemSelection(evt: KeyboardEvent, item: Item): boolean;
		initializeKeyboardNav(): void;
		isItem(item: Item): boolean;
		loadFolds(): void;
		onKeyArrowDown(evt: KeyboardEvent): void;
		onKeyArrowLeft(evt: KeyboardEvent): void;
		onKeyArrowRight(evt: KeyboardEvent): void;
		onKeyArrowUp(evt: KeyboardEvent): void;
		onKeyOpen(evt: MouseEvent): void;
		onResize(): void;
		/**
		 * Save fold data to the local storage.
		 */
		saveFolds(): void;
		selectItem(item: Item): void;
		setCollapseAll(): void;
		setFocusedItem(item: Item | null, scrollIntoView?: boolean): void;
		toggleCollapseAll(): void;
	}

	interface VirtualTreeSpec<Item extends VirtualItem> {
		app: App;
		containerEl: HTMLElement;
		getNodeId: (item: Item) => string;
		handleCollapseAll: () => unknown;
		handleDeleteSelectedItems: () => unknown;
		handleRenameFocusedItem: () => unknown;
		id: string;
		scope: Scope;
	}
}