import { type App, Plugin, type Debouncer, type PluginManifest, debounce, type WorkspaceLeaf, type EditorSuggest } from 'obsidian';
import { createEditorSuggestService } from './components/suggest/editor-suggest';
import { SettingManager } from './settings/setting-manager';
import { UndeferHandler } from './workspace/undefer-handler';

export abstract class PluginBase<T extends object> extends Plugin {
	public settings: T;
	public settingManager: SettingManager<this>;
	public requestSave: Debouncer<[], unknown>;

	public abstract get defaultSettings(): T;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.settingManager = new SettingManager(this);
		this.requestSave = debounce(() => this.saveSettings(), 100, true);
	}

	public async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, this.defaultSettings, await this.loadData());
	}

	public async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	public unload(): void {
		super.unload();
		this.app.workspace.trigger(`${this.manifest.id}:plugin-unload`, this);
	}

	public registerEditorSuggest(editorSuggest: EditorSuggest<any>, noCollision?: boolean): void {
		if (noCollision) {
			let service = createEditorSuggestService(editorSuggest);
			this.app.workspace.registerEditorExtension(service);
			this.register(() => this.app.workspace.unregisterEditorExtension(service));
		} else {
			super.registerEditorSuggest(editorSuggest);
		}
	}

	public runWhenUndeferred(leaf: WorkspaceLeaf, callback: (leaf: WorkspaceLeaf) => unknown): void {
		new UndeferHandler(leaf, callback, this);
	}
}