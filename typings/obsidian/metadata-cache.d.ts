import 'obsidian';

declare module 'obsidian' {
	interface FileCacheEntry {
		hash: string;
	}

	interface FrontMatterCache {
		aliases?: string[] | string;
		title?: string;
	}

	interface MetadataCache {
		fileCache: Record<string, FileCacheEntry>;
		getTags(): Record<string, number>;
		on(name: 'finished', callback: () => void): EventRef;
		onCleanCache(callback: () => void): void;
	}
}