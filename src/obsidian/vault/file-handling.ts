import { TAbstractFile, TFile, TFolder, type App } from 'obsidian';
import { splitPath } from './path';

/**
 * Create a file at given path. Will create a new folder if the target
 * folder is not exist yet.
 * 
 * @param path Path to the file. Created file may have differ path due to
 * another file with the same path already exists.
 */
export async function createFileAt(app: App, path: string): Promise<TFile> {
	let { parent, target, ext } = splitPath(path),
		mayBeFolder = app.vault.getAbstractFileByPath(parent);

	let folder: TFolder;

	for (let i = 1;; i++) {
		if (!mayBeFolder) {
			folder = await app.vault.createFolder(parent);
			break;
		}

		if (mayBeFolder instanceof TFolder) {
			folder = mayBeFolder;
			break;
		}

		mayBeFolder = app.vault.getAbstractFileByPath(parent + ' ' + i);
	}

	return await app.fileManager.createNewFile(folder, target, ext || 'md');
}

/**
 * Check whether the given file is a `TFile` instance.
 */
export function isFile(abstractFile: TAbstractFile | null): abstractFile is TFile {
	return abstractFile instanceof TFile;
}

/**
 * Check whether the given file is a `TFolder` instance.
 */
export function isFolder(abstractFile: TAbstractFile | null): abstractFile is TFolder {
	return abstractFile instanceof TFolder;
}

/**
 * Get `TAbstractFile` instance at the given path.
 */
export function getAbstractFile(app: App, path: string): TAbstractFile | null {
	return app.vault.getAbstractFileByPath(path);
}

export async function iterateAbstractFilesAsync(app: App, cb: (file: TAbstractFile) => Promise<unknown>): Promise<void> {
	let treePath: TFolder[] = [app.vault.getRoot()],
		indexes = [0];

	for (let deep = 0;;) {
		let parent = treePath[deep],
			children = parent.children,
			file = children[indexes[deep]];

		if (!file) {
			if (!deep) break;
			deep--;
			treePath.pop();
			indexes.pop();
			indexes[deep]++;
			continue;
		}

		await cb(file);

		if (isFolder(file)) {
			treePath.push(file);
			indexes.push(0);
			deep++;
		} else {
			indexes[deep]++;
		}
	}
}