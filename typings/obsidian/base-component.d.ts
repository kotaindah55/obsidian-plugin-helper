import 'obsidian';

declare module 'obsidian' {
	interface ButtonComponent {
		setLoading(on: boolean): this;
	}
	
	interface ColorComponent {
		colorPickerEl: HTMLInputElement;
	}

	interface ProgressBarComponent {
		progressBar: HTMLElement;
	}

	interface SearchComponent {
		/**
		 * Element that wraps the input element.
		 */
		containerEl: HTMLElement;
	}

	interface ValueComponent<T> {
		changeCallback?: (value: T) => unknown;
	}
}