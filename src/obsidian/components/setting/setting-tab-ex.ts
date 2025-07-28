import { PluginSettingTab } from 'obsidian';
import SettingEx from './setting-ex';
import SortableList from '../sortable-list';

export default abstract class SettingTabEx extends PluginSettingTab {
	protected registeredSettings: Record<string, SettingEx>;

	/**
	 * Hides the contents of the setting tab.
	 * Any registered components should be unloaded when the view is hidden.
	 * Override this if you need to perform additional cleanup.
	 * 
	 * _Call `super.hide()` when override it._
	 */
	public override hide(): void {
		this.containerEl.empty();
		this.registeredSettings = {};
	}

	public addSetting(cb: (setting: SettingEx) => unknown, id?: string): SettingEx {
		let setting = new SettingEx(this.containerEl);
		cb(setting);
		if (id) this.registeredSettings[id] = setting;
		return setting;
	}

	public addSortableList(cb: (list: SortableList) => unknown): SortableList {
		let sortableList = new SortableList(this.containerEl);
		cb(sortableList);
		return sortableList;
	}

	public toggleSetting(id: string, show: boolean, detach?: boolean): void {
		this.registeredSettings[id]?.setHidden(!show, detach);
	}

	public disableSetting(id: string, disabled: boolean): void {
		this.registeredSettings[id]?.setDisabled(disabled);
	}
}