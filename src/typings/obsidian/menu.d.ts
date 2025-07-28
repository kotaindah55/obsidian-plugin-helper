import 'obsidian';

declare module 'obsidian' {
	interface Menu {
		items: MenuItem[];
		sections: string[];
		addSections(sections: string[]): this;
	}

	namespace Menu {
		function forEvent(evt: MouseEvent): Menu;
	}
	
	interface MenuItem {
		iconEl: HTMLElement;
		section: string;
		submenu: Menu | null;
		removeIcon(): this;
		setChecked(checked: boolean): this;
		setSubmenu(): Menu;
		setWarning(on: boolean): this;
	}
}