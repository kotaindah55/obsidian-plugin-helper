import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class QuickSwitcherModal extends FileSuggestModal {
		constructor(app: App, options: QuickSwitcherOptions);
	}

	interface QuickSwitcherOptions {
		showAllFileTypes: boolean;
		showAttachments: boolean;
		showExistingOnly: boolean;
	}

	type QuickSwitcherPlugin = InternalPlugin<'switcher'>;

	/**
	 * @typeonly
	 */
	class QuickSwitcherPluginInstance extends InternalPluginInstance {
		QuickSwitcherModal: typeof QuickSwitcherModal;
	}
}