import { ExtraButtonComponent, ValueComponent, type IconName, type TooltipOptions } from 'obsidian';

export type CycleValue = string | boolean | number;

export interface TooltipSpec {
	tooltip: string;
	options?: TooltipOptions;
}

export class CycleButtonComponent extends ValueComponent<CycleValue> {
	public readonly cycleButtonEl: HTMLElement;

	private readonly button: ExtraButtonComponent;

	private options: Map<CycleValue, string>;
	private order: CycleValue[];
	private index: number;
	private tooltipCallback?: (value: CycleValue) => TooltipSpec | string | null;

	constructor(containerEl: HTMLElement) {
		super();
		this.button = new ExtraButtonComponent(containerEl);
		this.button.onClick(() => this.cycle());
		this.cycleButtonEl = this.button.extraSettingsEl;
		this.cycleButtonEl.addClass('cycle-button');

		this.options = new Map();
		this.order = [];
		this.index = 0;
	}

	public getValue(): CycleValue {
		return this.order[this.index] ?? '';
	}

	public setValue(value: CycleValue): this {
		this.index = this.order.findIndex(v => value === v);
		if (this.index < 0) this.index = 0;
		this.changeCallback?.(this.getValue());
		return this.display();
	}

	public addOption(value: CycleValue, icon: IconName, keepOrder?: boolean): this {
		this.options.set(value, icon);

		if (!this.order.includes(value) || !keepOrder) {
			this.order.remove(value);
			this.order.push(value);
		}
	
		return this.display();
	}

	public addOptions(options: Map<CycleValue, string>): this {
		this.options = new Map(options);
		this.order = [...options.keys()];
		return this.display();
	}

	public onChange(callback: (value: CycleValue) => unknown): this {
		this.changeCallback = callback;
		return this;
	}

	public cycle(trigger = true): this {
		let lastIndex = Math.max(0, this.order.length - 1);
		if (this.index >= lastIndex) this.index = 0;
		else this.index++;
		if (trigger) this.changeCallback?.(this.getValue());
		return this.display();
	}

	public setDisabled(disabled: boolean): this {
		super.setDisabled(disabled);
		this.button.setDisabled(disabled);
		return this;
	}

	public setDynamicTooltip(callback: (value: CycleValue) => TooltipSpec | string | null) {
		this.tooltipCallback = callback;
		return this.displayDynamicTooltip();
	}

	private display(): this {
		let val = this.getValue(),
			icon = this.options.get(val);

		this.button.setIcon(icon ?? '');
		this.displayDynamicTooltip();
		return this;
	}

	private displayDynamicTooltip(): this {
		let spec = this.tooltipCallback?.(this.getValue());
		if (!spec) return this;

		if (typeof spec == 'string') spec = {
			tooltip: spec
		};

		this.setTooltip(spec.tooltip, spec.options);
		return this;
	}

	private setTooltip(tooltip: string, options?: TooltipOptions): this {
		this.button.setTooltip(tooltip, options);
		return this;
	}
}