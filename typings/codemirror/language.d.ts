import type { ParseContext } from '@codemirror/language';
import type { NodeProp, Tree } from '@lezer/common';
import type { StateEffectType, StateField } from '@codemirror/state';

declare module '@codemirror/language' {
	const lineClassNodeProp: NodeProp<string>;
	const tokenClassNodeProp: NodeProp<string>;

	namespace Language {
		const setState: StateEffectType<LanguageState>;
		const state: StateField<LanguageState>;
	}

	/**
	 * MIT licensed, copyright (c) by Marijn Haverbeke and others at
	 * CodeMirror.
	 * 
	 * @see https://github.com/codemirror/language/blob/main/src/language.ts
	 * @typeonly
	 */
	class LanguageState {
		readonly tree: Tree;
		readonly context: ParseContext;
	}

	/**
	 * MIT licensed, copyright (c) by Marijn Haverbeke and others at
	 * CodeMirror.
	 * 
	 * @see https://github.com/codemirror/language/blob/main/src/language.ts
	 */
	interface ParseContext {
		tree: Tree;
		treeLen: number;
	}
}