import { Component } from 'obsidian';

export interface TouchState {
	ts: number;
	startX: number;
	startY: number;
	endX: number;
	endY: number;
}

export class TouchStateObserver extends Component {
	public readonly state: TouchState;
	public readonly win: Window;

	constructor(win: Window) {
		super();
		this.win = win;
		this.state = {
			ts: 0,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0
		};
	}

	public onload(): void {
		this.registerDomEvent(this.win, 'touchstart', evt => this.onTouchStart(evt));
		this.registerDomEvent(this.win, 'touchend', evt => this.onTouchEnd(evt));
	}

	public stillSteadyAfterSecond(evt: MouseEvent): boolean {
		if (Date.now() - this.state.ts < 1000) return false;
		return (
			Math.abs(evt.clientX - this.state.startX) < 5 && Math.abs(evt.clientY - this.state.startY) < 5 ||
			Math.abs(evt.clientX - this.state.endX) < 5 && Math.abs(evt.clientY - this.state.endY) < 5
		);
	}

	private onTouchStart(evt: TouchEvent): void {
		if (evt.touches.length !== 1) return;
		this.state.startX = evt.changedTouches[0].clientX;
		this.state.startY = evt.changedTouches[0].clientY;
		this.state.ts = Date.now();
	}

	private onTouchEnd(evt: TouchEvent): void {
		if (evt.touches.length !== 1) return;
		this.state.endX = evt.changedTouches[0].clientX;
		this.state.endY = evt.changedTouches[0].clientY;
		this.state.ts = Date.now();
	}
}