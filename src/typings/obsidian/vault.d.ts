import 'obsidian';

declare module 'obsidian' {
	interface VaultConfig {
		mobileQuickRibbonItem?: string;
		nativeMenus?: boolean | null;
	}

	interface TAbstractFile {
		deleted: boolean;
	}

	interface TFile {
		getShortName(): string;
	}

	interface Vault {
		config: VaultConfig;
		getAvailablePath(path: string, extension?: string): string;
		getConfig<T extends keyof VaultConfig>(key: T): VaultConfig[T];
	}
}