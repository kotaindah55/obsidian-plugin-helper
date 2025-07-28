import { Text } from '@codemirror/state';

declare module '@codemirror/state' {
	/**
	 * MIT licensed, copyright (c) by Marijn Haverbeke and others at
	 * CodeMirror.
	 * 
	 * @see https://github.com/codemirror/state/blob/main/src/text.ts
	 * @typeonly
	 */
	class TextNode extends Text {
		readonly children: readonly Text[];
	}

	/**
	 * MIT licensed, copyright (c) by Marijn Haverbeke and others at
	 * CodeMirror.
	 * 
	 * @see https://github.com/codemirror/state/blob/main/src/text.ts
	 * @typeonly
	 */
	class TextLeaf extends Text {
		readonly children: null;
		text: string[];
	}
}