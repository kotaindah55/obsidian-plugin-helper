import 'obsidian';

declare module 'obsidian' {
	interface TaskQueue {
		cancel: () => void;
		high: boolean;
	}
}