type TaskOperation = (state: Readonly<TaskerState>) => Promise<unknown> | unknown;

interface TaskRef {
	readonly id: string;
	readonly delay: number;
	readonly label?: string;
}

export interface TaskerState {
	cancelCurrent: boolean;
}

export class Tasker {
	private readonly state: TaskerState;
	private readonly queue: { ref: TaskRef, op: TaskOperation }[];
	
	private current: TaskRef | null;
	private running: boolean;

	constructor() {
		this.state = { cancelCurrent: false };
		this.queue = [];
		this.current = null;
		this.running = false;
	}

	public enqueue(operation: TaskOperation, delay: number = 5, label?: string): TaskRef {
		let ref: TaskRef = {
			id: Date.now().toString(36),
			delay,
			label
		};

		this.queue.push({ ref, op: operation });
		this.run();

		return ref;
	}

	public cancel(): void {
		if (!this.running) return;

		let currIdx = this.getCurrIdx();
		if (currIdx >= 0) this.queue.splice(currIdx + 1);

		this.state.cancelCurrent = true;
	}

	public cancelLabel(label: string): void {
		if (!this.running) return;
		
		let currIdx = this.getCurrIdx(),
			idxs: number[] = [];

		this.queue.forEach((item, idx) => {
			if (idx < currIdx || item.ref.label !== label) return;
			if (idx === currIdx) this.state.cancelCurrent = true;
			else idxs.push(idx);
		});

		for (let i = idxs.length - 1; i >= 0; i--)
			this.queue.splice(idxs[i], 1);
	}

	public cancelRef(ref: TaskRef): void {
		if (!this.running) return;
		
		let currIdx = this.getCurrIdx(),
			targetIdx = this.queue.findIndex(item => item.ref === ref);

		if (targetIdx < 0 || targetIdx < currIdx) return;
		if (targetIdx === currIdx) this.state.cancelCurrent = true;
		else this.queue.splice(targetIdx, 1);
	}

	private getCurrIdx(): number {
		return this.current
			? this.queue.findIndex(item => item.ref == this.current)
			: -1;
	}

	private async run(): Promise<void> {
		if (this.running) return;
		this.running = true;

		for (let i = 0; i < this.queue.length; i++) {
			let { ref, op } = this.queue[i];
			this.current = ref;

			if (ref.delay > 0) await sleep(ref.delay);

			let opReturn = op(this.state);
			if (opReturn instanceof Promise) await opReturn;

			this.state.cancelCurrent = false;
			this.current = null;
		}

		this.queue.splice(0);
		this.running = false;
	}
}