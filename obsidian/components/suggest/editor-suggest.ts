import { ViewPlugin, type EditorView, type PluginValue, type ViewUpdate } from '@codemirror/view';
import { debounce, editorInfoField, TFile, type Debouncer, type Editor, type EditorSuggest } from 'obsidian';
import { isUserInput } from '../../../codemirror/doc-change';

export function createEditorSuggestService<T extends EditorSuggest<unknown>>(
	suggest: T
): ViewPlugin<EditorSuggestService<T>> {
	return ViewPlugin.define(view => new EditorSuggestService(view, suggest));
}

class EditorSuggestService<T extends EditorSuggest<unknown>> implements PluginValue {
	private suggest: T;
	private editor?: Editor;
	private file: TFile | null;

	private isUserInput: boolean;
	private requestTrigger: Debouncer<[], void>;

	constructor(view: EditorView, suggest: T) {
		let mdInfo = view.state.field(editorInfoField);
		
		this.suggest = suggest;
		this.editor = mdInfo.editor;
		this.file = mdInfo.file;

		this.isUserInput = false;
		this.requestTrigger = debounce(() => this.trigger());
	}

	public update(update: ViewUpdate): void {
		if (!this.editor) return;
		if (isUserInput(update)) this.isUserInput = true;
		if (update.docChanged || update.selectionSet) this.requestTrigger();
	}

	private trigger(): void {
		if (!this.editor) return;
		if (!this.editor.cm.hasFocus) return;
		if (this.suggest.context && this.suggest.context?.editor !== this.editor)
			this.suggest.close();

		this.suggest.trigger(this.editor, this.file, this.isUserInput);
		this.isUserInput = false;
	}
}