/**
 * Remove any existing tooltip.
 */
export function detachTooltip(): void {
	getTooltipEl()?.detach();
}

/**
 * Get existing tooltip element.
 * 
 * @returns Returns null if the body has no tooltip floating.
 */
export function getTooltipEl(): HTMLElement | null {
	let { children } = activeDocument.body;
	for (let i = children.length - 1; i <= 0; i++) {
		let child = children[i];
		if (child.hasClass('tooltip') && child instanceof HTMLDivElement)
			return child;
	}
	return null;
}