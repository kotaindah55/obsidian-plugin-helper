import { AbstractInputSuggest, TextComponent } from 'obsidian';

type SuggestConstructor = (inputEl: HTMLInputElement | HTMLDivElement) => AbstractInputSuggest<unknown>;

/**
 * Text component that provides suggest.
 */
export class SuggestTextComponent extends TextComponent {
	/**
	 * Currently attached suggest.
	 */
	public suggest?: AbstractInputSuggest<unknown>;

	/**
	 * Set suggest to the component.
	 * 
	 * @param suggestConstructor - {@link SuggestConstructor | `SuggestConstructor`} function.
	 */
	public setSuggester(suggestConstructor: SuggestConstructor): this {
		if (this.suggest) return this;
		this.suggest = suggestConstructor(this.inputEl);
		return this;
	}
}