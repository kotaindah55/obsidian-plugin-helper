import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class PluginManager {
		enabledPlugins: Set<string>;
		requestSaveConfig: Debouncer<[], void>;
		disablePluginAndSave(id: string): Promise<void>;
		enablePluginAndSave(id: string): Promise<boolean>;
		getPlugin(id: string): Plugin | null;
	}
}