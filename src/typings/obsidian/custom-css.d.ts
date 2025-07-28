import 'obsidian';

declare module 'obsidian' {
	/**
	 * @typeonly
	 */
	class CustomCss extends Component {
		theme: string;
	}
}