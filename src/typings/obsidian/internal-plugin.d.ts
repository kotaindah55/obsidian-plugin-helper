import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class InternalPlugin<T extends InternalPluginID> extends Component {
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
			[ID in keyof InternalPluginInstanceMap]: InternalPlugin<InternalPluginInstanceMap[ID]>;
		};
		getPluginById<T extends IntenalPluginIDs>(id: T): InternalPlugin<InternalPluginInstanceMap[T]>;
		getEnabledPluginById<T extends IntenalPluginIDs>(id: T): InternalPluginInstanceMap[T] | null;
	}

	type IntenalPluginIDs = keyof InternalPluginInstanceMap;

	type InternalPluginViewTypes<T extends InternalPluginID> = InternalPluginViewTypesMap[T];

	interface InternalPluginViewTypesMap {
		'bookmarks': 'bookmarks';
		'file-explorer': 'file-explorer';
		'properties': 'all-properties' | 'file-properties';
		'switcher': never;
		'tag-pane': 'tag';
		'webviewer': never;
	}
}