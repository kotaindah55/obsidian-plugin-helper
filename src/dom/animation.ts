export interface PlayAnimationSpec {
	targetEl: HTMLElement;
	keyframes: PropertyIndexedKeyframes | Keyframe[] | null;
	easing: string;
	duration: number;
	onRemove?: (targetEl: HTMLElement) => void;
}

export function playAnimation(spec: PlayAnimationSpec): Animation {
	let { targetEl, keyframes, easing, duration, onRemove } = spec;

	let win = targetEl.win,
		evtAborter = new AbortController();

	let removeAnimState = () => {
		onRemove?.(targetEl);
		evtAborter.abort();
		win.clearTimeout(timer);
	};

	// Fallback timer
	let timer = win.setTimeout(removeAnimState, duration + 100),
		anim = targetEl.animate(keyframes, { easing, duration });
	
	anim.addEventListener('finish', removeAnimState, { signal: evtAborter.signal });
	anim.addEventListener('cancel', removeAnimState, { signal: evtAborter.signal });
	// anim.addEventListener('remove', removeAnimState, { signal: evtAborter.signal });

	return anim;
}

export function cancelAnimations(el: HTMLElement): void {
	el.getAnimations().forEach(anim => anim.cancel());
}