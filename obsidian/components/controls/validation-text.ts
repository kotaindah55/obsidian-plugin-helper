import { displayTooltip, type TooltipPlacement } from 'obsidian';
import { detachTooltip, getTooltipEl } from '../tooltip';
import SuggestTextComponent from './suggest-text';

/**
 * Fuction that validates given value, may return a promise.
 */
type ValidatorFn = (value: string) => boolean | Promise<boolean>;

/**
 * Text component that can validate value each input change.
 */
export default class ValidationTextComponent extends SuggestTextComponent {
	/**
	 * Currently active validator.
	 */
	public validator?: RegExp | ValidatorFn;
	public isWarning: boolean;
	public messageCallback?: (val: string) => DocumentFragment | string;

	constructor(containerEl: HTMLElement) {
		super(containerEl);
		this.isWarning = false;
	}

	public onChange(callback: (value: string, valid: boolean) => unknown): this {
		super.onChange(async value => {
			let valid = await this.checkValidity();
			callback(value, valid);
		});
		return this;
	}

	/**
	 * Set a validator to the component.
	 * 
	 * @param pattern - May be string, regexp, or a function.
	 */
	public setValidation(pattern: string | RegExp | ValidatorFn): this {
		if (!pattern) return this;

		this.validator = typeof pattern === 'function'
			? pattern
			: RegExp(pattern);

		return this;
	}

	/**
	 * Check if the current value is valid.
	 */
	public checkValidity(): Promise<boolean> | boolean {
		let { inputEl } = this,
			valid: Promise<boolean> | boolean = true;
		
		if (this.validator) valid = this.validator instanceof RegExp
			? this.validator.test(inputEl.value)
			: this.validator(inputEl.value);

		let shouldWarn = this.isWarning && !valid;
		inputEl.toggleClass('mod-invalid', shouldWarn);
		if (shouldWarn) this.displayWarningTooltip();
		else detachTooltip();

		return valid;
	}

	/**
	 * Set whether the component should display a warning when the input is not valid.
	 */
	public setWarning(on: boolean): this {
		this.isWarning = on;
		return this;
	}

	/**
	 * Set warning message displayed as a tooltip.
	 * 
	 * @param cb - Can return string or `DocumentFragment`.
	 * @returns 
	 */
	public setWarningMessage(cb: (val: string) => string | DocumentFragment): this {
		this.messageCallback = cb;
		return this;
	}

	/**
	 * Display a warning tooltip.
	 */
	public async displayWarningTooltip(): Promise<void> {
		let message = this.messageCallback?.(this.getValue());
		if (!message || message instanceof DocumentFragment && !message.hasChildNodes()) {
			detachTooltip();
			return;
		}

		await sleep(10);

		let placement: TooltipPlacement = 'bottom';

		if (this.suggest?.isOpen) {
			let suggestElTop = this.suggest.suggestEl.clientTop,
				inputElTop = this.inputEl.clientTop;
			if (suggestElTop >= inputElTop) placement = 'top';
		}

		getTooltipEl()?.toggleClass('mod-top', placement == 'top');

		displayTooltip(this.inputEl, message, {
			classes: ['mod-warning'], placement
		});
	}
}