import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class TagCollapsibleTreeItem extends TreeItem implements CollapsibleTreeItem {
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
	class TagCollapsibleTreeItemWrapper extends TagCollapsibleTreeItem {}

	/**
	 * @typeonly
	 */
	class TagTreeItem extends TagCollapsibleTreeItemWrapper implements ParentVirtualItem<TagTreeItem> {
		info: VirtualItemInfo;
		onRender?: () => void;
		parent: TagTreeItem | TreeRoot<TagTreeItem>;
		pusherEl: HTMLElement;
		tag: string;
		tagView: TagView;
		vChildren: VirtualChildren<this, TagTreeItem>;
		setTag(tag: string): this;
	}

	type TagPanePlugin = InternalPlugin<'tag-pane'>;

	/**
	 * @typeonly
	 */
	class TagPanePluginInstance implements InternalPluginInstance {}

	/**
	 * @typeonly
	 */
	class TagPaneVirtualTree extends VirtualTree<TagTreeItem> {
		view: TagView;
	}

	/**
	 * @typeonly
	 */
	class TagView extends ItemView {
		tagDoms: Record<string, TagTreeItem>;
		tree: TagPaneVirtualTree;
		updateTags(): void;
	}
}