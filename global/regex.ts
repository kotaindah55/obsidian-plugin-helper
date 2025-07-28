/**
 * Remove forwardslash delimiters from regexp if present.
 */
export function unwrapRegexp(value: string): RegExp | undefined {
	let regexp: RegExp | undefined;
	try {
		regexp = value.startsWith('/') && value.endsWith('/')
			? new RegExp(value.slice(1, -1))
			: new RegExp(value);
	} catch { /* empty */ };
	return regexp;
}

export function literalize(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function concatStringsToRegexp(strings: string[], modifier = 'g'): RegExp {
	return new RegExp(strings.join('|'), modifier);
}