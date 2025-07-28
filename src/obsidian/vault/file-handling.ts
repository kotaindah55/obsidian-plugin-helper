import { TFile, TFolder, type App } from 'obsidian';
import { splitPath } from './path';

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