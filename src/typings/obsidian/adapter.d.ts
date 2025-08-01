import 'obsidian';
import type fs from 'node:fs';
import type fsPromises from 'node:fs/promises';
import type { Filesystem } from '@capacitor/filesystem';

declare module 'obsidian' {
	interface CapacitorAdapter {
		fs: typeof Filesystem;
	}

	interface FileSystemAdapter {
		fs: typeof fs;
		fsPromises: typeof fsPromises;
	}
}