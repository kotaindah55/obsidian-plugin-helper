import { ButtonComponent } from 'obsidian';

/**
 * Button component with some extra functionality.
 */
export default class ButtonExComponent extends ButtonComponent {
	/**
	 * Toggle cta style on and off.
	 */
	public toggleCta(on: boolean): this {
		this.setNormal();
		this.buttonEl.toggleClass('mod-cta', on);
		return this;
	}

	/**
	 * Toggle warning style on and off.
	 */
	public toggleWarning(on: boolean): this {
		this.setNormal();
		this.buttonEl.toggleClass('mod-warning', on);
		return this;
	}

	/**
	 * Toggle destructive style on and off.
	 */
	public toggleDestrcutive(on: boolean): this {
		this.setNormal();
		this.buttonEl.toggleClass('mod-destructive', on);
		return this;
	}

	/**
	 * Toggle muted style on and off.
	 */
	public toggleMuted(on: boolean): this {
		this.setNormal();
		this.buttonEl.toggleClass('mod-muted', on);
		return this;
	}

	/**
	 * Toggle cancel style on and off. The effect is seen in phone only.
	 */
	public toggleCancel(on: boolean): this {
		this.setNormal();
		this.buttonEl.toggleClass('mod-cancel', on);
		return this;
	}

	/**
	 * Reset to the initial style.
	 */
	public setNormal(): this {
		this.buttonEl.removeClasses([
			'mod-cta',
			'mod-warning',
			'mod-destructive',
			'mod-muted',
			'mod-cancel'
		]);
		return this;
	}
}