import { type App, FileView, type TFile, type WorkspaceLeaf } from 'obsidian';
import { createFileAt } from '../vault/file-handling';

/**
 * Get filepath from the {@link FileView} instance that's wrapped the
 * given {@link leaf}.
 */
export function getFilepathFromLeaf(leaf: WorkspaceLeaf): string | null {
	let filepath: string | null = null,
		viewState = leaf.getViewState();

	if (leaf.view instanceof FileView && leaf.view.file)
		filepath = leaf.view.file.path;
	else if (typeof viewState.state?.file == 'string')
		filepath = viewState.state.file;

	return filepath;
}

export async function openFile(app: App, file: TFile, newTab = false): Promise<WorkspaceLeaf> {
	let targetLeaf = newTab
		? app.workspace.getLeaf('tab')
		: app.workspace.getMostRecentLeaf() ?? app.workspace.getLeaf();

	await targetLeaf.openFile(file);
	return targetLeaf;
}

export async function createAndOpen(app: App, path: string, newTab = false): Promise<WorkspaceLeaf> {
	let file = await createFileAt(app, path);
	return await openFile(app, file, newTab);
}