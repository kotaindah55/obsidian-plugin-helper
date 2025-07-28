import { ValueComponent } from 'obsidian';

export default class DateTimeComponent extends ValueComponent<number> {
	public dateTimeInputEl: HTMLInputElement;

	constructor(containerEl: HTMLElement) {
		super();
		this.dateTimeInputEl = containerEl.createEl('input', { type: 'datetime-local' });
		this.dateTimeInputEl.addEventListener('input', () => {
			this.changeCallback?.(this.getValue());
		});
	}

	public getValue(): number {
		return this.dateTimeInputEl.valueAsNumber;
	}

	public getValueString(): string {
		return this.dateTimeInputEl.value;
	}

	public getValueDate(): Date | null {
		return this.dateTimeInputEl.valueAsDate;
	}

	public setValue(value: number): this {
		this.dateTimeInputEl.valueAsNumber = value;
		this.changeCallback?.(this.getValue());
		return this;
	}

	public setValueString(value: string): this {
		this.dateTimeInputEl.value = value;
		this.changeCallback?.(this.getValue());
		return this;
	}

	public setValueDate(value: Date): this {
		this.dateTimeInputEl.valueAsDate = value;
		this.changeCallback?.(this.getValue());
		return this;
	}

	public setNow(): this {
		this.setValue(Date.now());
		this.changeCallback?.(this.getValue());
		return this;
	}

	public setMax(value: string | number | Date): this {
		if (value instanceof Date) {
			this.dateTimeInputEl.max = value.toISOString();
		} else if (typeof value == 'number') {
			this.dateTimeInputEl.max = new Date(value).toISOString();
		} else {
			this.dateTimeInputEl.max = value;
		}

		return this;
	}

	public setMin(value: string | number | Date): this {
		if (value instanceof Date) {
			this.dateTimeInputEl.min = value.toISOString();
		} else if (typeof value == 'number') {
			this.dateTimeInputEl.min = new Date(value).toISOString();
		} else {
			this.dateTimeInputEl.min = value;
		}

		return this;
	}

	public setType(type: 'date' | 'time' | 'datetime-local'): this {
		this.dateTimeInputEl.type = type;
		return this;
	}

	public onChange(callback: (value: number) => unknown): this {
		this.changeCallback = callback;
		return this;
	}

	public setDisabled(disabled: boolean): this {
		super.setDisabled(disabled);
		this.dateTimeInputEl.disabled = disabled;
		return this;
	}
}