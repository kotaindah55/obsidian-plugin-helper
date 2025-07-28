import { parseLinktext } from 'obsidian';

/**
 * Check whether the given link is formatted as a wikilink.
 */
export function isWikilink(link: string): boolean {
	return link.startsWith('[[') && link.endsWith(']]');
}

/**
 * Get file path from a wikilink.
 * @param wikilink Wikilink that's delimited by double square brackets.
 */
export function getPathFromWikilink(wikilink: string): string {
	// Remove its delimiters.
	if (isWikilink(wikilink))
		wikilink = wikilink.slice(2, wikilink.length - 2);

	// Remove link alias.
	let aliasOffset = wikilink.indexOf('|');
	if (aliasOffset >= 0) wikilink = wikilink.slice(0, aliasOffset);

	// Get file path from the link.
	let { path } = parseLinktext(wikilink);
	if (path.indexOf('.') < 0) path += '.md';

	return path;
}