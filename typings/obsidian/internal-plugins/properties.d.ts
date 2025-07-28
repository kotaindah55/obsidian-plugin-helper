import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class AllPropertiesView extends ItemView {
		doms: Record<string, PropertyTreeItem>;
		tree: PropertyVirtualTree;
	}

	/**
	 * @typeonly
	 */
	class FilePropertiesView extends EditableFileView {
		metadataEditor: MetadataEditor;
	}

	type PropertiesPlugin = InternalPlugin<'properties'>;

	/**
	 * @typeonly
	 */
	class PropertiesPluginInstance implements InternalPluginInstance {}

	/**
	 * @typeonly
	 */
	class PropertyTreeItem extends TreeItem implements VirtualItem {
		app: App;
		count: number;
		flairEl: HTMLElement;
		iconEl: HTMLElement;
		info: VirtualItemInfo;
		onRender?: () => void;
		property: PropertyEntryData<unknown>;
		view: AllPropertiesView;
		setProperty(info: PropertyInfo): this;
		updateTitle(): void;
	}

	interface PropertyVirtualTree extends VirtualTree<PropertyTreeItem> {
		view: AllPropertiesView;
	}
}