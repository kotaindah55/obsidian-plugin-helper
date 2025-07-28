import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class WebviewerDBStore {
		db: IDBDatabase;
		getHistoryItems(): Promise<WebviewerHistoryItem[]>;
	}

	interface WebviewerHistoryItem {
		accessTs: number;
		id: number;
		title: string;
		url: string;
	}

	type WebviewerPlugin = InternalPlugin<'webviewer'>;

	/**
	 * @typeonly
	 */
	class WebviewerPluginInstance implements InternalPluginInstance {
		db: WebviewerDBStore;
		getSearchEngineUrl(query: string): string;
	}
}