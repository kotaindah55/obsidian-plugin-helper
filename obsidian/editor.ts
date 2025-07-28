import { EditorView } from '@codemirror/view';
import type { MarkdownView } from 'obsidian';

export function scrollMDViewInto(mdView: MarkdownView, offset: number): void {
	let cmView = mdView.editor.cm,
		lineIndex = cmView.state.doc.lineAt(offset).number - 1;

	cmView.dispatch({
		selection: { anchor: offset },
		effects: EditorView.scrollIntoView(offset, {
			y: 'center'
		})
	});
	
	if (mdView.getMode() == 'preview') {
		let { renderer } = mdView.previewMode;
		renderer.onRendered(async () => {
			renderer.applyScroll(lineIndex, { center: true });
		});
	}
}

export function highlightLine(mdView: MarkdownView, line: number): void {
	let range = {
		from: { ch: 0, line },
		to: { ch: mdView.editor.getLine(line).length, line }
	};

	mdView.editor.scrollIntoView(range, true);
	mdView.editor.addHighlights([range], 'is-flashing', true);
	
	if (mdView.getMode() == 'preview') {
		let { renderer } = mdView.previewMode;
		renderer.onRendered(async () => {
			renderer.applyScroll(line, { center: true, highlight: true });
		});
	}
}