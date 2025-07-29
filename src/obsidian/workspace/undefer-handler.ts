import { type App, Component, type View, type WorkspaceLeaf } from 'obsidian';
import type PluginBase from '../plugin-base';

export default class UndeferHandler extends Component {
	public app: App;
	public leaf: WorkspaceLeaf;
	public view: View;
	public plugin: PluginBase<object>;
	public callback?: (leaf: WorkspaceLeaf) => unknown;

	constructor(
		leaf: WorkspaceLeaf,
		callback: (leaf: WorkspaceLeaf) => unknown,
		plugin: PluginBase<object>
	) {
		super();
		this.app = leaf.app;
		this.leaf = leaf;
		this.view = leaf.view;
		this.plugin = plugin;
		this.callback = callback;

		this.view.addChild(this);
	}

	public onload(): void {
		if (!this.leaf.isDeferred) {
			this.view.removeChild(this);
			return;
		}

		this.app.workspace.on(`${this.plugin.manifest.id}:plugin-unload`, plugin => {
			if (plugin instanceof Plugin && plugin == this.plugin)
				this.detach();
		});
	}

	public onunload(): void {
		if (this.callback) this.runCallback();
	}

	public detach(): void {
		delete this.callback;
		this.view.removeChild(this);
	}

	private async runCallback(): Promise<void> {
		// Run the callback after the actual view has been loaded
		await sleep(0);
		// Do not run the callback if the deferred view was unloaded
		// because of being closed
		if (
			!this.leaf.isDeferred &&
			this.leaf.parent &&
			this.leaf.view.getViewType() !== 'empty'
		) {
			this.callback?.(this.leaf);
		}
	}
}