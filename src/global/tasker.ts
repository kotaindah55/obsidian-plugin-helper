export interface TaskRef {
	readonly id: string;
	label?: string;
}

export class TaskerState {
	public mustCancel: boolean;
	public pauseState: Promise<void>;
	public running?: TaskRef;

	public readonly cancelledRef: Set<TaskRef>;
	public get mustCancelCurrent(): boolean {
		return (
			this.mustCancel ||
			this.running !== undefined && this.cancelledRef.has(this.running)
		);
	}

	constructor(cancelledRef: Set<TaskRef>) {
		this.mustCancel = false;
		this.cancelledRef = cancelledRef;
		this.pauseState = Promise.resolve();
	}
}

export default class Tasker {
	private pending: Promise<unknown> | null;
	private queued: number;
	private refs: Set<TaskRef>;
	private cancelledRefs: Set<TaskRef>;
	private labeledRefs: Record<string, TaskRef[]>;
	private resumer?: () => void;

	private readonly state: TaskerState;

	constructor() {
		this.pending = null;
		this.queued = 0;
		this.refs = new Set();
		this.cancelledRefs = new Set();
		this.labeledRefs = {};
		this.state = new TaskerState(this.cancelledRefs);
	}

	public queue(
		operation: (state: TaskerState) => Promise<unknown>,
		delay = 5,
		label?: string
	): TaskRef | undefined {
		let prevTask = this.pending,
			ref: TaskRef = { id: Date.now().toString(36), label };

		this.pushRef(ref);
		this.queued++;
		this.pending = (async () => {
			await prevTask;
			await this.state.pauseState;
			this.queued--;

			run_task: if (!this.state.mustCancel && !this.cancelledRefs.has(ref)) {
				await sleep(delay);
				if (this.state.mustCancel || this.cancelledRefs.has(ref))
					break run_task;
				this.state.running = ref;
				await this.state.pauseState;
				await operation(this.state);
			}

			this.state.running = undefined;
			this.removeRef(ref);

			if (this.queued <= 0) this.reset();
		})();

		return ref;
	}

	public cancel(): void {
		if (!this.pending) return;
		this.state.mustCancel = true;
	}

	public cancelRef(ref: TaskRef): void {
		if (!this.refs.has(ref)) return;
		this.cancelledRefs.add(ref);
	}

	public cancelLabel(label: string): void {
		let ref: TaskRef | undefined,
			refs = this.labeledRefs[label];
		while (ref = refs?.shift()) {
			delete ref.label;
			this.cancelRef(ref);
		}
		delete this.labeledRefs[label];
	}

	public pause(): void {
		if (!this.resumer) return;
		this.state.pauseState = new Promise(
			resolve => this.resumer = resolve
		);
	}

	public resume(): void {
		this.resumer?.();
		delete this.resumer;
	}

	private reset(): void {
		this.pending = null;
		this.state.mustCancel = false;
	}

	private pushRef(ref: TaskRef): void {
		this.refs.add(ref);
		let { label } = ref;
		if (label) {
			this.labeledRefs[label] ??= [];
			this.labeledRefs[label].push(ref);
		}
	}

	private removeRef(ref: TaskRef): void {
		this.refs.delete(ref);
		this.cancelledRefs.delete(ref);
		let { label } = ref;
		if (label) {
			this.labeledRefs[label]?.remove(ref);
			if (this.labeledRefs[label]?.length === 0) {
				delete this.labeledRefs[label];
			}
		}
	}
}