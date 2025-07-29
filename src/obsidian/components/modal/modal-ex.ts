import type { App } from 'obsidian';
import { EventTargetModal } from './event-target-modal';
import { ButtonExComponent } from '../controls/button-ex';
import { SettingEx } from '../setting/setting-ex';
import { SortableList } from '../sortable-list';

interface ModalButtonOption {
	asNav?: boolean;
	secondary?: boolean;
}

export default class ModalEx extends EventTargetModal {
	public readonly buttonContainerEl: HTMLElement;
	public readonly buttons: ButtonExComponent[];

	public navButton: ButtonExComponent | null;
	public navButtonSecondary: ButtonExComponent | null;

	protected registeredSettings: Record<string, SettingEx>;

	constructor(app: App) {
		super(app);
		this.buttonContainerEl = this.modalEl.createDiv('modal-button-container');
		this.buttons = [];
		this.navButton = null;
		this.navButtonSecondary = null;
		this.registeredSettings = {};

		this.buttonContainerEl.hide();
	}

	public close(): void {
		super.close();
		this.registeredSettings = {};
	}

	public addButton(cb: (btn: ButtonExComponent) => unknown, option: ModalButtonOption = {}): this {
		let { asNav = false, secondary = false } = option,
			button = new ButtonExComponent(createDiv());

		if (secondary) button.setClass('mod-secondary');

		if (asNav) {
			if (secondary) {
				this.navButtonSecondary?.buttonEl.detach();
				this.navButtonSecondary = button;
				this.buttonContainerEl.after(button.buttonEl);
			} else {
				this.navButton?.buttonEl.detach();
				this.navButton = button;
				this.modalEl.append(button.buttonEl);
			}

			button.setClass('modal-nav-action');
			if (!secondary) button.setClass('mod-primary');
		}
		
		else {
			if (secondary) {
				this.buttons.first()?.buttonEl.removeClass('mod-secondary');
				this.buttons.unshift(button);
				this.buttonContainerEl.prepend(button.buttonEl);
			} else {
				this.buttons.push(button);
				this.buttonContainerEl.append(button.buttonEl);
			}

			this.buttonContainerEl.show();
		}

		cb(button);

		return this;
	}

	public addSetting(cb: (setting: SettingEx) => unknown, id?: string): SettingEx {
		let setting = new SettingEx(this.contentEl);
		cb(setting);
		if (id) this.registeredSettings[id] = setting;
		return setting;
	}

	public addSortableList(cb: (list: SortableList) => unknown): SortableList {
		let sortableList = new SortableList(this.contentEl);
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