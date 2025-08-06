import { type App, type TAbstractFile, TFile } from 'obsidian';

/**
 * Check whether the current file has the property.
 */
export function hasProperty(app: App, file: TAbstractFile, prop: string): boolean {
	if (!(file instanceof TFile)) return false;
	let metadata = app.metadataCache.getFileCache(file);
	if (!metadata?.frontmatter) return false;
	return prop in metadata.frontmatter;
}