import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class InternalPlugin<T extends InternalPluginIDs> extends Component {
		instance: InternalPluginInstanceMap[T];
		views: { [V in InternalPluginViewTypes<T>]: TypedViewCreator<ViewTypeMap[V]> };
	}

	interface InternalPluginInstance {}

	interface InternalPluginInstanceMap {
		'bookmarks': BookmarksPluginInstance;
		'file-explorer': FileExplorerPluginInstance;
		'properties': PropertiesPluginInstance;
		'switcher': QuickSwitcherPluginInstance;
		'tag-pane': TagPanePluginInstance;
		'webviewer': WebviewerPluginInstance;
	}

	/**
	 * @typeonly
	 */
	class InternalPluginManager extends Events {
		plugins: {
			[ID in InternalPluginIDs]: InternalPlugin<ID>;
		};
		getPluginById<T extends InternalPluginIDs>(id: T): InternalPlugin<T>;
		getEnabledPluginById<T extends InternalPluginIDs>(id: T): InternalPluginInstanceMap[T] | null;
	}

	type InternalPluginIDs = keyof InternalPluginInstanceMap;

	type InternalPluginViewTypes<T extends InternalPluginIDs> = InternalPluginViewTypesMap[T];

	interface InternalPluginViewTypesMap {
		'bookmarks': 'bookmarks';
		'file-explorer': 'file-explorer';
		'properties': 'all-properties' | 'file-properties';
		'switcher': never;
		'tag-pane': 'tag';
		'webviewer': never;
	}
}