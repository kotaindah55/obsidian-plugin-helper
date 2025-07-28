import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class MetadataTypeManager extends Events {
		properties: Record<string, PropertyInfo>;
		registeredTypeWidgets: { [K in keyof PropertyValueTypeMap]: PropertyTypeWidget<K> };
		types: Record<string, { name: string, type: string }>;
		getTypeInfo(entry: PropertyEntryData<unknown>): PropertyTypeInfo;
	}
}