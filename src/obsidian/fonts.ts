import { Platform } from 'obsidian';

/**
 * Try to get system fonts.
 * 
 * @returns Might returns empty array.
 */
export async function getSystemFonts(): Promise<string[]> {
	let fonts: string[] | undefined;

	if (Platform.isDesktopApp) try {
		let { getFonts } = require('font-list');
		fonts = await getFonts({ disableQuoting: true });
	} catch { /* empty */ }
	
	else if (Platform.isMobileApp) try {
		fonts = await (window.Capacitor.Plugins.App.getFonts?.() ?? []);
	} catch { /* empty */ }

	return fonts ?? [];
}