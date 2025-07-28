import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class HotkeyManager {
		get customKeys(): Record<string, Hotkey[]>;
	}
}