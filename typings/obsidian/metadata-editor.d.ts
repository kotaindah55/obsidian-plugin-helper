import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class AliasesPropertyWidget extends FocusableComponent implements MultiSelectPropertyWidget {
		ctx: PropertyWidgetContext;
		multiselect: MultiSelectComponent;
	}

	/**
	 * @typeonly
	 */
	class FocusableComponent extends Component {
		focus(): void;
		onFocus(): void;
	}

	/**
	 * @typeonly
	 */
	class MetadataEditor extends Component {
		owner: View;
		propertyListEl: HTMLElement;
		rendered: PropertyEditor[];
		synchronize(frontmatter: Frontmatter): void;
	}

	/**
	 * @typeonly
	 */
	class MultiSelectComponent {
		elements: HTMLElement[];
		optionRenderer?: (value: string, pill: MultiSelectPillDOM) => void;
		values: string[];
		setOptionRenderer(renderer: (value: string, pill: MultiSelectPillDOM) => void): this;
	}

	interface MultiSelectPillDOM {
		el: HTMLElement;
		pillEl: HTMLElement;
	}

	interface MultiSelectPropertyWidget extends PropertyWidget {
		multiselect: MultiSelectComponent;
	}

	/**
	 * @typeonly
	 */
	class MultiTextPropertyWidget extends FocusableComponent implements MultiSelectPropertyWidget {
		ctx: PropertyWidgetContext;
		multiselect: MultiSelectComponent;
	}

	/**
	 * @typeonly
	 */
	class PropertyEditor extends Component {
		app: App;
		containerEl: HTMLElement;
		entry?: PropertyEntryData<unknown>;
		iconEl: HTMLElement;
		keyInputEl: HTMLInputElement;
		metadataEditor: MetadataEditor;
		rendered: AliasesPropertyWidget | MultiTextPropertyWidget | TagsPropertyWidget | TextPropertyWidget | null;
		typeInfo: PropertyTypeInfo;
		valueEl: HTMLElement;
		renderProperty(
			entry: PropertyEntryData<unknown>,
			checkErrors?: boolean,
			useExpectedType?: boolean
		): void;
	}

	interface PropertyTypeInfo {
		expected: PropertyTypeWidget<unknown>;
		inferred: PropertyTypeWidget<unknown>;
	}

	interface PropertyTypeWidget<T> {
		icon: string;
		type: string;
		render: (
			containerEl: HTMLElement,
			data: PropertyEntryData<T>,
			context: PropertyWidgetContext
		) => T extends string ? PropertyWidgetMap[T] : null;
	}

	interface PropertyWidget extends FocusableComponent {
		ctx: PropertyWidgetContext;
	}

	interface PropertyWidgetContext {
		key: string;
		metadataEditor: MetadataEditor;
		onChange: (value: unknown) => void;
	}

	interface PropertyWidgetMap {
		'aliases': AliasesPropertyWidget;
		'checkbox': null;
		'date': null;
		'datetime': null;
		'multitext': MultiTextPropertyWidget;
		'number': null;
		'tags': TagsPropertyWidget;
		'text': TextPropertyWidget;
		[key: string]: PropertyWidget | null;
	}

	/**
	 * @typeonly
	 */
	class TagsPropertyWidget extends FocusableComponent implements MultiSelectPropertyWidget {
		ctx: PropertyWidgetContext;
		multiselect: MultiSelectComponent;
	}

	/**
	 * @typeonly
	 */
	class TextPropertyWidget extends FocusableComponent implements PropertyWidget {
		ctx: PropertyWidgetContext;
		linkTextEl: HTMLElement;
		getLinkText(): string;
		isWikilink(): boolean;
	}
}