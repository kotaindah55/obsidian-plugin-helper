import { AbstractInputSuggest, App, EditorSuggest, type Instruction } from 'obsidian';
import { cancelAnimations, playAnimation } from '../../../dom/animation';

export default abstract class SettledSuggest<T> extends AbstractInputSuggest<T> {
	protected containerEl: HTMLElement;
	protected instructionsEl: HTMLElement;

	public beingOpened: boolean;
	public beingClosed: boolean;

	constructor(
		app: App,
		inputEl: HTMLInputElement | HTMLDivElement,
		containerEl: HTMLElement
	) {
		super(app, inputEl);
		this.containerEl = containerEl;
		this.instructionsEl = createDiv('prompt-instructions');
		this.beingOpened = false;
		this.beingClosed = false;
	}

	public override open(): void {
		if (this.isOpen) return;

		cancelAnimations(this.suggestEl);

		this.isOpen = true;
		this.beingOpened = true;
		this.app.keymap.pushScope(this.scope);
		this.containerEl.appendChild(this.suggestEl);
		
		let initHeight = getComputedStyle(this.suggestEl).height;
		this.suggestEl.setCssStyles({ overflow: 'hidden' });

		playAnimation({
			targetEl: this.suggestEl,
			keyframes: { height: ['0px', initHeight] },
			easing: 'cubic-bezier(0.64, 0, 0.78, 0)', // Quint-in
			duration: 150,
			onRemove: targetEl => {
				this.beingOpened = false;
				targetEl.setCssStyles({ overflow: '' });
			}
		});
	}

	public override close(): void {
		if (!this.isOpen) return;

		cancelAnimations(this.suggestEl);

		this.app.keymap.popScope(this.scope);
		this.isOpen = false;
		this.beingOpened = false;
		this.beingClosed = true;

		let initHeight = getComputedStyle(this.suggestEl).height;
		this.suggestEl.setCssStyles({ overflow: 'hidden' });
		
		playAnimation({
			targetEl: this.suggestEl,
			keyframes: { height: [initHeight, '0px'] },
			easing: 'cubic-bezier(0.22, 1, 0.36, 1)', // Quint-out
			duration: 150,
			onRemove: () => {
				if (this.isOpen) return;
				this.suggestEl.detach();
				this.suggestions.setSuggestions([]);
				this.beingClosed = false;
			}
		});
	}

	public forceClose(): void {
		this.beingOpened = false;
		this.beingClosed = false;
		super.close();
	}

	protected getSelected(): T | undefined {
		return this.suggestions.values?.[this.suggestions.selectedItem];
	}

	protected setInstructions(instructions: Instruction[]): void {
		EditorSuggest.prototype.setInstructions.call(this, instructions);
	}
}