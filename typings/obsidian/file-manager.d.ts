import 'obsidian';

declare module 'obsidian' {
	interface FileManager {
		app: App;
		createNewFile(location?: TFolder, filename?: string, extension?: string, contents?: string): Promise<TFile>;
		promptForDeletion(file: TAbstractFile): Promise<void>;
		renameProperty(oldKey: string, newKey: string): Promise<void>;
	}
}