import { Setting } from 'obsidian';
import ValidationTextComponent from '../controls/validation-text';
import ComplexControlComponent from '../controls/complex-control';
import CycleButtonComponent from '../controls/cycle-button';
import DateTimeComponent from '../controls/date-time';
import SuggestTextComponent from '../controls/suggest-text';
import ButtonExComponent from '../controls/button-ex';

export default class SettingEx extends Setting {
	private hidePlaceholder: Comment;

	constructor(containerEl: HTMLElement) {
		super(containerEl);
		this.hidePlaceholder = new Comment();
	}

	public addButtonEx(cb: (text: ButtonExComponent) => unknown): this {
		let component = new ButtonExComponent(this.controlEl);
		this.components.push(component);
		cb(component);
		return this;
	}

	public addValidationText(cb: (text: ValidationTextComponent) => unknown): this {
		let component = new ValidationTextComponent(this.controlEl);
		this.components.push(component);
		cb(component);
		return this;
	}

	public addCycleButton(cb: (button: CycleButtonComponent) => unknown): this {
		let component = new CycleButtonComponent(this.controlEl);
		this.components.push(component);
		cb(component);
		return this;
	}

	public addDateTime(cb: (button: DateTimeComponent) => unknown): this {
		let component = new DateTimeComponent(this.controlEl);
		this.components.push(component);
		cb(component);
		return this;
	}

	public addSuggestText(cb: (button: SuggestTextComponent) => unknown): this {
		let component = new SuggestTextComponent(this.controlEl);
		this.components.push(component);
		cb(component);
		return this;
	}

	public addComplexControl<T>(cb: (control: ComplexControlComponent<T>) => unknown): this {
		let component = new ComplexControlComponent<T>(this.controlEl);
		this.components.push(component);
		cb(component);
		return this;
	}

	public setHidden(hidden: boolean, detach?: boolean): this {
		this.settingEl.toggle(!hidden);

		if (hidden && detach && this.settingEl.parentElement) {
			this.settingEl.before(this.hidePlaceholder);
			this.settingEl.detach();
		}

		else if (!hidden && !this.settingEl.parentElement && this.hidePlaceholder.parentElement) {
			this.hidePlaceholder.before(this.settingEl);
			this.hidePlaceholder.detach();
		}

		return this;
	}
}