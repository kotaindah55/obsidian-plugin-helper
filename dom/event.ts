/**
 * Alternative (polyfill) to the `contextmenu` and `touch*` events,
 * especially on iOS devices.
 * 
 * @param el Any HTML element to which the handler attached.
 * @param handler Handler to be executed upon fired event.
 * @param duration Default to 800 ms.
 * @param option The same interface as the `addEventListener` option.
 * 
 * @returns Function used for detaching the handler.
 */
export function handleLongPress(
	el: HTMLElement,
	handler: (evt: PointerEvent) => void,
	duration: number = 800,
	option?: AddEventListenerOptions
): () => void {
	let outerHandler = (evt: PointerEvent) => {
		// Used to abort long press handler for being executed.
		let aborter = new AbortController(),
			timer = el.win.setTimeout(() => {
				handler(evt);
				el.win.navigator?.vibrate(100);
				aborter.abort();
			}, duration),
			cancelFn = () => {
				el.win.clearTimeout(timer);
				aborter.abort();
			};

		// If touch/cursor released before the timer is running out, call the
		// aborter.
		el.addEventListener('pointerleave', cancelFn, { signal: aborter.signal });
		el.addEventListener('pointerup', cancelFn, { signal: aborter.signal });
	};

	el.addEventListener('pointerdown', outerHandler, option);
	// Run this to remove the listener.
	return () => el.removeEventListener('pointerdown', outerHandler);
}