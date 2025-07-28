import { normalizePath } from 'obsidian';

export interface PathComponents {
	parent: string;
	name: string;
	ext: string;
}

/**
 * Split vault relative path into parent path, file name, and extension.
 */
export function splitPath(path: string): {
	parent: string;
	target: string;
	ext: string;
} {
	path = normalizePath(path);

	if (path.startsWith('/') && path.length > 1)
		path = path.slice(1);

	let lastSlashOffset = path.lastIndexOf('/'),
		target = path.slice(lastSlashOffset + 1),
		parent: string,
		ext = '';

	if (lastSlashOffset > 0) {
		parent = path.slice(0, lastSlashOffset);
	} else {
		parent = '/';
	}

	let lastDotOffset = target.lastIndexOf('.');

	if (lastDotOffset >= 0)
		ext = target.slice(lastDotOffset + 1, target.length);

	return { parent, target, ext };
}