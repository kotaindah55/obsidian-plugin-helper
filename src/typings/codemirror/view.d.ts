import type { EditorState } from '@codemirror/state';
import type {
	EditorView,
	layer,
	LayerMarker,
	PluginValue,
	ViewPlugin,
	ViewUpdate
} from '@codemirror/view';

declare module '@codemirror/view' {
	type LayerConfig = Parameters<typeof layer>[0];

	type LayerPluginInstance = PluginInstance<LayerView>;

	/**
	 * Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin>
	 * and others at CodeMirror. Licensed under MIT.
	 * 
	 * @see https://github.com/codemirror/view/blob/main/src/layer.ts
	 * @typeonly
	 */
	class LayerView extends PluginValue {
		readonly layer: LayerConfig;
		readonly view: EditorView;
		dom: HTMLElement;
		drawn: readonly LayerMarker[];
		measureReq: MeasureRequest<readonly LayerMarker[]>;
		scaleX: number;
		scaleY: number;
		draw(markers: readonly LayerMarker[]): void;
		measure(): readonly LayerMarker[];
		scale(): void;
		setOrder(state: EditorState): void;
	}

	/**
	 * Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin>
	 * and others at CodeMirror. Licensed under MIT.
	 * 
	 * @see https://github.com/codemirror/view/blob/main/src/extension.ts
	 * @typeonly
	 */
	class MeasureRequest<T> {
		key?: unknown;
		read(view: EditorView): T;
		write?(measure: T, view: EditorView): void;
	}

	/**
	 * Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin>
	 * and others at CodeMirror. Licensed under MIT.
	 * 
	 * @see https://github.com/codemirror/view/blob/main/src/extension.ts
	 * @typeonly
	 */
	class PluginInstance<T extends PluginValue = PluginValue> {
		mustUpdate: ViewUpdate | null;
		spec: ViewPlugin<T> | null;
		value: T | null;
		deactivate(): void;
		destroy(view: EditorView): void;
		update(view: EditorView): PluginInstance<T>;
	}

	interface WidgetType {
		become(dom: HTMLElement, widget: WidgetType): void;
	}
}