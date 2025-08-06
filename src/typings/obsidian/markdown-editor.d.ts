import 'obsidian';
import { EditorView } from '@codemirror/view';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class MarkdownBaseView extends Component {
		app: App;
		editorEl: HTMLElement;
		cm: EditorView;
		owner: MarkdownFileInfo;
	}

	interface MarkdownEditView extends MarkdownScrollableEditView {}

	/**
	 * @typeonly
	 */
	class MarkdownScrollableEditView extends MarkdownBaseView {
		search: EditorSearch;
	}
}