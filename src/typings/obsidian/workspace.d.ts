import 'obsidian';
import type { Workspace } from 'obsidian';
import type { Extension } from '@codemirror/state';

declare module 'obsidian' {
	interface DeferredLeaf extends WorkspaceLeaf {
		view: DeferredView;
		get isDeferred(): true;
	}

	interface TypedWorkspaceLeaf<T extends View> extends WorkspaceLeaf {
		view: T;
		get isDeferred(): false;
	}

	interface Workspace {
		editorSuggest: EditorSuggestManager;
		createLeafInTabGroup(tabs?: WorkspaceTabs): WorkspaceLeaf;
		getLeavesOfType<T extends keyof ViewTypeMap>(viewType: T): (TypedWorkspaceLeaf<ViewTypeMap[T]> | DeferredLeaf)[];
		/**
		 * Triggered when any available editor has its selection changed.
		 */
		on(name: 'editor-selection-change', callback: (editor: Editor, info: MarkdownFileInfo) => unknown, ctx?: unknown): EventRef;
		on(name: 'leaf-menu', callback: (menu: Menu, leaf: WorkspaceLeaf) => unknown, ctx?: unknown): EventRef;
		on(name: 'tab-group-menu', callback: (menu: Menu, tab: WorkspaceTabs) => unknown, ctx?: unknown): EventRef;
		on(name: string, callback: (...args: unknown[]) => unknown, ctx?: unknown): EventRef;
		onDragLeaf(evt: DragEvent, leaf: WorkspaceLeaf): void;
		registerEditorExtension(extension: Extension): void;
		unregisterEditorExtension(extension: Extension): void;
	}

	interface WorkspaceItem {
		containerEl: HTMLElement;
	}

	interface WorkspaceLeaf {
		app: App;
		rebuildView(): Promise<void>;
		_empty: EmptyView;
		_originView: View;
	}

	interface WorkspaceMobileDrawer {
		activeTabContentEl: HTMLElement;
		activeTabHeaderEl: HTMLElement;
		activeTabIconEl: HTMLElement;
		activeTabSelectEl: HTMLSelectElement;
	}

	interface WorkspaceRibbon {
		items: RibbonItem[];
		ribbonItemsEl: HTMLElement | null;
		addRibbonItemButton(id: string, icon: IconName, title: string, callback: () => unknown): HTMLElement;
	}

	interface WorkspaceTabs {
		isStacked: boolean;
		children: WorkspaceLeaf[];
	}
}