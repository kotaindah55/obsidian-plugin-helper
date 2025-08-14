import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class MobileTab {
		leaf: WorkspaceLeaf;
		placeholderEl: HTMLElement;
	}

	/**
	 * @typeonly
	 */
	class MobileTabSwitcher {
		tabPreviewLookup: WeakMap<WorkspaceLeaf, MobileTab>;
		render(): void;
	}
}