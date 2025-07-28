import 'obsidian';

declare module 'obsidian' {
	interface App {
		appId: string;
		customCss: CustomCss;
		dom: AppDOM;
		dragManager: DragManager;
		hotkeyManager: HotkeyManager;
		internalPlugins: InternalPluginManager;
		metadataTypeManager: MetadataTypeManager;
		mobileNavbar: MobileNavbar | null;
		plugins: PluginManager;
		setting: AppSetting;
		getObsidianUrl(file: TFile): string;
	}

	/**
	 * @typeonly
	 */
	class AppDOM {
		appContainerEl: HTMLElement;
	}

	/**
	 * @typeonly
	 */
	class AppSetting extends Modal {}
}