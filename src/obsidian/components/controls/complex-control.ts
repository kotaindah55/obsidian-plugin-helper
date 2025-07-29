import {
	AbstractTextComponent,
	BaseComponent,
	ButtonComponent,
	ColorComponent,
	DropdownComponent,
	ExtraButtonComponent,
	MomentFormatComponent,
	ProgressBarComponent,
	SearchComponent,
	SliderComponent,
	TextAreaComponent,
	TextComponent,
	ToggleComponent,
	ValueComponent
} from 'obsidian';
import type { ControlComponent } from './control-component';
import { CycleButtonComponent } from './cycle-button';
import { DateTimeComponent } from './date-time';
import { ValidationTextComponent } from './validation-text';
import { SuggestTextComponent } from './suggest-text';
import { ButtonExComponent } from './button-ex';

interface DynamicComponent<T> extends ValueComponent<T> {
	onChange(callback: (value: T) => unknown): this;
}

/**
 * Get the primary element of base component implementations.
 * 
 * @returns Can return `null` when the provided compenent does not have
 * any primary element in it.
 */
function getControlComponentEl(component: BaseComponent): HTMLElement | null {
	let compEl: HTMLElement | null = null;

	switch (true) {
		case component instanceof ButtonComponent:
			compEl = component.buttonEl;
			break;
		case component instanceof CycleButtonComponent:
			compEl = component.cycleButtonEl;
			break;
		case component instanceof SearchComponent:
			compEl = component.containerEl;
			break;
		case component instanceof AbstractTextComponent:
			compEl = component.inputEl;
			break;
		case component instanceof ExtraButtonComponent:
			compEl = component.extraSettingsEl;
			break;
		case component instanceof ProgressBarComponent:
			compEl = component.progressBar;
			break;
		case component instanceof ToggleComponent:
			compEl = component.toggleEl;
			break;
		case component instanceof SliderComponent:
			compEl = component.sliderEl;
			break;
		case component instanceof ColorComponent:
			compEl = component.colorPickerEl;
			break;
		case component instanceof DropdownComponent:
			compEl = component.selectEl;
			break;
		case component instanceof ComplexControlComponent:
			compEl = component.complexEl;
			break;
		case component instanceof DateTimeComponent:
			compEl = component.dateTimeInputEl;
			break;
	}

	return compEl;
}

/**
 * Component that can have multiple child control components, whose the
 * parent control can switch between them via its value.
 */
export class ComplexControlComponent<T> extends ValueComponent<T> {
	/**
	 * Primary element of this component. Must be a {@link DynamicComponent | `DynamicComponent`}
	 * in order to be able to switch between the children.
	 */
	public readonly complexEl: HTMLElement;
	public readonly childControlEl: HTMLElement;
	public readonly parentControlEl: HTMLElement;
	
	public parent: DynamicComponent<T>;
	
	/**
	 * Mapped childern based on the parent value.
	 */
	private readonly childMap: Map<T, ControlComponent | ComplexControlComponent<unknown>>;

	constructor(containerEl: HTMLElement) {
		super();
		this.complexEl = containerEl.createDiv('complex-control-container');
		this.childControlEl = this.complexEl.createDiv('child-control-container');
		this.parentControlEl = this.complexEl.createDiv('parent-control-container');
		this.childMap = new Map();

		this.childControlEl.hide();
	}

	/**
	 * Get the current value of the parent.
	 */
	public getValue(): T {
		return this.parent?.getValue();
	}

	/**
	 * Get current child that matches current value.
	 */
	public getCurrentChild(): ControlComponent | ComplexControlComponent<unknown> | undefined {
		return this.childMap.get(this.getValue());
	}

	/**
	 * Set a value to the parent element.
	 */
	public setValue(value: T): this {
		this.parent?.setValue(value);
		return this.displayChild(value);
	}

	public setDisabled(disabled: boolean): this {
		super.setDisabled(disabled);
		this.parent?.setDisabled(disabled);
		this.childMap.forEach(comp => comp.setDisabled(disabled));
		return this;
	}

	/**
	 * Set a parent control into this component.
	 * 
	 * @param creator Function that returns a parent component.
	 */
	public setParent(creator: (containerEl: HTMLElement) => DynamicComponent<T>): this {
		this.parent = creator(this.parentControlEl);
		let oldChangeCallback = this.parent.changeCallback;
		this.parent.onChange(val => {
			oldChangeCallback?.(val);
			this.displayChild(val);
		});
		return this;
	}

	/**
	 * Add a child control based on the parent value.
	 * 
	 * @param value When matches the parent value, the child will be
	 * displayed. Otherwise, it will be hidden.
	 * @param child Any child control component.
	 */
	public addChild(value: T | T[], child: ControlComponent | ComplexControlComponent<unknown>): this {
		if (!(value instanceof Array)) value = [value];
		value.forEach(val => {
			this.childMap.set(val, child);
			if (this.getValue() === value) this.displayChild(val);
		});
		return this;
	}

	public addButton(value: T | T[], cb: (btn: ButtonComponent) => unknown): this {
		let component = new ButtonComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addButtonEx(value: T | T[], cb: (btn: ButtonExComponent) => unknown): this {
		let component = new ButtonExComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addExtraButton(value: T | T[], cb: (btn: ExtraButtonComponent) => unknown): this {
		let component = new ExtraButtonComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addProgressBar(value: T | T[], cb: (progress: ProgressBarComponent) => unknown): this {
		let component = new ProgressBarComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addToggle(value: T | T[], cb: (toggle: ToggleComponent) => unknown): this {
		let component = new ToggleComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addText(value: T | T[], cb: (text: TextComponent) => unknown): this {
		let component = new TextComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addValidationText(value: T | T[], cb: (text: ValidationTextComponent) => unknown): this {
		let component = new ValidationTextComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addTextArea(value: T | T[], cb: (textArea: TextAreaComponent) => unknown): this {
		let component = new TextAreaComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addSearch(value: T | T[], cb: (search: SearchComponent) => unknown): this {
		let component = new SearchComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addMomentFormat(value: T | T[], cb: (text: MomentFormatComponent) => unknown): this {
		let component = new MomentFormatComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addColorPicker(value: T | T[], cb: (picker: ColorComponent) => unknown): this {
		let component = new ColorComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addSlider(value: T | T[], cb: (slider: SliderComponent) => unknown): this {
		let component = new SliderComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addDropdown(value: T | T[], cb: (dropdown: DropdownComponent) => unknown): this {
		let component = new DropdownComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addDateTime(value: T | T[], cb: (dropdown: DateTimeComponent) => unknown): this {
		let component = new DateTimeComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addSuggestText(value: T | T[], cb: (dropdown: SuggestTextComponent) => unknown): this {
		let component = new SuggestTextComponent(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	public addComplexControl<U>(value: T | T[], cb: (complex: ComplexControlComponent<U>) => unknown): this {
		let component = new ComplexControlComponent<U>(createDiv());
		cb(component);
		return this.addChild(value, component);
	}

	private displayChild(value: T): this {
		let child = this.childMap.get(value);

		if (!child) {
			this.childControlEl.empty();
			this.childControlEl.hide();
			return this;
		}

		let compEl = getControlComponentEl(child);

		if (!compEl) this.childControlEl.empty();
		else if (this.childControlEl != compEl.parentElement) {
			this.childControlEl.empty();
			this.childControlEl.append(compEl);
		}

		this.childControlEl.show();

		return this;
	}
}