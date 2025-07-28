import 'obsidian';

declare module 'obsidian' {
	type Frontmatter = Record<string, unknown>;

	interface PropertyEntryData<T> {
		key: string;
		type: string;
		value: T extends string ? PropertyValueTypeMap[T] : PropertyValueType;
	}

	interface PropertyInfo {
		count: number;
		name: string;
		type: string;
	}

	type PropertyValueType =
		| string
		| number
		| boolean
		| object
		| PropertyValueType[];

	interface PropertyValueTypeMap {
		'aliases': string[];
		'checkbox': boolean;
		'date': string;
		'datetime': string;
		'multitext': string[];
		'number': number;
		'tags': string[];
		'text': string;
		[key: string]: PropertyValueType;
	}
}