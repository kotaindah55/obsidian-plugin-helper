export interface PlainRange {
	from: number;
	to: number;
}

/**
 * Region defined here as a `PlainRange` collection arranged in an array.
 * Each range inside should be sorted in order according to its `from`.
 */
export type Region = PlainRange[];

/**
 * Indicates that the input {@link range} touches any range of the {@link region}.
 */
export function isRegionTouchedByRange(
	range: PlainRange,
	region: Region | readonly PlainRange[]
): boolean {
	return region.some(({ from, to }) => range.to >= from && range.from <= to);
}

/**
 * Whether {@link rangeA} is inside {@link rangeB}.
 */
export function isInside(rangeA: PlainRange, rangeB: PlainRange): boolean {
	return (
		rangeA.from > rangeB.from &&
		rangeA.to < rangeB.to
	);
}

/**
 * Efficiently find a range at the given offset with logarithmic
 * complexity.
 * 
 * @param ranges Must be less-to-great sorted, non-overlapped, sequence
 * of ranges.
 * @param exact If set to true, returned range must touch the given
 * offset. Otherwise, this returns null.
 */
export function fastFind<T extends PlainRange>(
	ranges: T[],
	offset: number,
	exact = false
): {
	range: T,
	index: number
} | null {
	if (!ranges.length) return null;

	if (ranges.length <= 32) {
		for (let i = 0; i < ranges.length; i++) {
			if (ranges[i].to >= offset) {
				if (exact && ranges[i].from > offset) break;
				return { range: ranges[i], index: i };
			}
		}
		return null;
	}

	// Factor of the ranges.
	let factor = 4096,
		shift = 1,
		index = 0;

	while (factor) {
		if (ranges.length > factor) while (ranges[index].from <= offset) {
			let end = Math.min(index + factor, ranges.length);
			if (ranges[end - 1].to < offset) index = end;
			else break;
		}
		if (factor === 4) break;
		factor >>= shift;
		shift++;
	}

	for (
		let end = Math.min(index + factor, ranges.length);
		index < end && ranges[index].to < offset;
		index++
	);
	
	let result =  index < ranges.length
		? { range: ranges[index], index }
		: null;

	if (exact && result && result.range.from > offset)
		result = null;
	return result;
}

/**
 * Join two regions into a single region.
 */
export function joinRegions(regionA: Region, regionB: Region): Region {
	let unionRegion: Region = [];

	for (let i = 0, j = 0; i < regionA.length || j < regionB.length;) {
		// Joinned range only occurs between two touched/intersected ranges.
		if (!regionB[j] || regionA[i] && regionA[i].to < regionB[j].from) {
			unionRegion.push(Object.assign({}, regionA[i]));
			i++; continue;
		}

		if (!regionA[i] || regionB[j] && regionB[j].to < regionA[i].from) {
			unionRegion.push(Object.assign({}, regionB[j]));
			j++; continue;
		}

		unionRegion.push({
			from: Math.min(regionA[i].from, regionB[j].from),
			to: Math.max(regionA[i].to, regionB[j].to)
		});

		i++; j++;
	}

	return unionRegion;
}

/**
 * Check whether the offset touches the range.
 */
export function isTouchedByOffset(offset: number, range: PlainRange): boolean {
	return offset >= range.from && offset <= range.to;
}