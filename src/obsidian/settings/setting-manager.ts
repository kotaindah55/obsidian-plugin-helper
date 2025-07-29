import { type EventRef, Events } from 'obsidian';
import type { PluginBase } from '../plugin-base';

/**
 * Act like an event loop for settings change.
 */
interface SettingManager<T> {
	/**
	 * Triggered when some settings were changed.
	 */
	on(
		name: 'settings-change',
		callback: (changed: Partial<T['settings']>) => unknown,
		ctx?: unknown
	): EventRef;
}

class SettingManager<T extends PluginBase<object>> extends Events {
	private plugin: T;
	private candidate: Partial<T['settings']>;

	constructor(plugin: T) {
		super();
		this.plugin = plugin;
		this.candidate = {};
	}

	/**
	 * Commit a change to the given setting.
	 */
	public commit<K extends keyof T['settings']>(key: K, value: T['settings'][K]): void {
		if (this.plugin.settings[key as keyof object] === value) {
			delete this.candidate[key];
		} else {
			this.candidate[key] = value;
		}
	}

	/**
	 * Save suspended candidate to the plugin settings.
	 * @param trigger Whether triggers the settings change event.
	 */
	public save(trigger = true): void {
		if (Object.isEmpty(this.candidate)) return;

		Object.assign(this.plugin.settings, this.candidate);
		this.plugin.requestSave();

		if (trigger) this.trigger('settings-change', this.candidate);
		this.candidate = {};
	}
}

export { SettingManager };