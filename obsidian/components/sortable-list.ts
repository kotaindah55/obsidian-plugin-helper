import { BaseComponent, Setting } from 'obsidian';

interface Coords { x: number; y: number }

interface SortableListState {
	dragged: Setting;
	index: number;
	oldIndex: number;
}

/**
 * Container of draggable and sortable setting list.
 */
export default class SortableList extends BaseComponent {
	public containerEl: HTMLElement;
	public listEl: HTMLElement;
	public readonly settings: Setting[];

	private aborter: AbortController;
	private ghostEl: HTMLElement | null;
	private state: SortableListState | null;
	
	private addCallback?: (setting: Setting) => unknown;
	private removeCallback?: (setting: Setting) => unknown;
	private moveCallback?: (setting: Setting, newIndex: number, oldIndex: number) => unknown;
	private endCallback?: (setting: Setting, newIndex: number, oldIndex: number) => unknown;

	private get bodyEl(): HTMLElement {
		return this.listEl.doc.body;
	}

	constructor(containerEl: HTMLElement) {
		super();
		this.containerEl = containerEl;
		this.listEl = this.containerEl.createDiv({ cls: 'sortable-list' });
		this.settings = [];
		this.ghostEl = null;
		this.aborter = new AbortController();
	}

	/**
	 * Add a {@link Setting} component to the sortable list.
	 * @param constructor {@link Setting} class or its derivatives.
	 * @param args {@link constructor | Constructor} arguments.
	 */
	public addSetting<T extends Setting, C extends new (...args: unknown[]) => T>(
		constructor: C,
		args: ConstructorParameters<C>,
		callback?: (setting: T, list: this) => unknown
	): this {
		let handle: HTMLElement | undefined,
			setting = new constructor(...args).addExtraButton(btn => btn
				.setIcon('lucide-menu')
				.setTooltip('Drag to rearrange')
				.then(btn => handle = btn.extraSettingsEl)
			);

		// Drag & drop (mouse)
		handle?.addEventListener('mousedown', evt => {
			this.handleDragStart(evt, setting);
			this.bodyEl.doc.addEventListener('mousemove', evt => this.handleDragMove(evt, setting), {
				signal: this.aborter.signal
			});
			this.bodyEl.doc.addEventListener('mouseup', () => this.handleDragEnd(setting), {
				signal: this.aborter.signal
			});
		});

		// Drag & drop (multi-touch)
		handle?.addEventListener('touchstart', evt => {
			evt.preventDefault();
			let touch = evt.touches[0];
			this.handleDragStart({ x: touch.clientX, y: touch.clientY }, setting);
			handle?.addEventListener('touchmove', evt => {
				evt.preventDefault();
				let touch = evt.touches[0];
				this.handleDragStart({ x: touch.clientX, y: touch.clientY }, setting)
			}, { signal: this.aborter.signal });
			handle?.addEventListener('touchend', () => this.handleDragEnd(setting), {
				signal: this.aborter.signal
			});
			handle?.addEventListener('touchcancel', () => this.handleDragEnd(setting), {
				signal: this.aborter.signal
			});
		});

		this.settings.push(setting);
		this.addCallback?.(setting);
		callback?.(setting, this);
		return this;
	}

	/**
	 * Remove the given {@link setting} from the list if any.
	 */
	public removeSetting(setting: Setting): this {
		if (!this.settings.contains(setting)) return this;

		this.settings.remove(setting);
		// Detaching its element from the DOM.
		setting.settingEl.detach();
		this.removeCallback?.(setting);

		return this;
	}

	public onAdd(callback: (setting: Setting) => unknown): this {
		this.addCallback = callback;
		return this;
	}

	public onRemove(callback: (setting: Setting) => unknown): this {
		this.removeCallback = callback;
		return this;
	}

	public onMove(callback: (setting: Setting, newIndex: number, oldIndex: number) => unknown): this {
		this.moveCallback = callback;
		return this;
	}

	public onEnd(callback: (setting: Setting, newIndex: number, oldIndex: number) => unknown): this {
		this.endCallback = callback;
		return this;
	}

	/**
	 * Abort and detach all listeners that are attached to the aborter.
	 */
	public abort(): this {
		this.aborter.abort();
		this.aborter = new AbortController();
		this.ghostEl = null;
		this.state = null;
		this.bodyEl.removeClass('is-grabbing');

		// Clean up any drag ghosts left hanging.
		for (const ghostEl of activeDocument.body.findAll(':scope > .iconic-drag-ghost')) {
			ghostEl.detach();
		}

		return this;
	}

	/**
	 * Clear all listed settings.
	 */
	public clear(): this {
		this.listEl.empty();
		this.settings.splice(0);
		return this;
	}

	/**
	 * Move the ghost element to the given {@link coords | coordinate}.
	 */
	private moveGhostEl(coords: Coords): void {
		let { x, y } = coords;
		this.ghostEl?.setCssStyles({
			left: this.bodyEl.hasClass('mod-rtl')
				? `calc(${x}px - var(--drag-position-indent))`
				: `calc(${x - this.ghostEl.clientWidth}px + var(--drag-position-indent))`,
			top: y - this.ghostEl.clientHeight / 2 + 'px',
		});
	}

	/**
	 * Executed when starts dragging.
	 */
	private handleDragStart(coords: Coords, setting: Setting): void {
		if (this.disabled) return;

		let { settingEl } = setting;
		navigator?.vibrate(100); // Not supported on iOS
		this.bodyEl.addClass('is-grabbing');

		// Remove native ghost element.
		if (coords instanceof DragEvent) coords.dataTransfer?.setDragImage(
			createDiv(), 0, 0
		);
		
		// Create drag ghost
		let settingGhostEl = settingEl.cloneNode(true) as HTMLElement,
			posIndent = settingEl.getBoundingClientRect().right - coords.x;
		this.ghostEl = this.bodyEl.createDiv({ cls: 'drag-reorder-ghost iconic-drag-ghost' });
		this.ghostEl.append(settingGhostEl);

		let selectEls = settingEl.querySelectorAll('select'),
			ghostSelectEls = settingGhostEl.querySelectorAll('select');
		selectEls.forEach((el, index) => ghostSelectEls[index].value = el.value);

		// Configure drag ghost position.
		settingGhostEl.setCssStyles({
			width: settingEl.clientWidth + 'px',
			height: settingEl.clientHeight + 'px'
		});
		this.ghostEl.setCssProps({
			'--drag-position-indent': posIndent + 'px'
		});
		this.moveGhostEl(coords);

		// Show drop zone effect
		settingEl.addClass('drag-ghost-hidden');

		this.state = {
			dragged: setting,
			index: this.settings.indexOf(setting),
			oldIndex: 0
		};
		this.state.oldIndex = this.state.index;
	}

	/**
	 * Executed when moving the dragged {@link setting}, and run the
	 * {@link moveCallback} callback.
	 */
	private handleDragMove(coords: Coords, setting: Setting): void {
		if (!this.state) {
			this.state = {
				dragged: setting,
				index: this.settings.indexOf(setting),
				oldIndex: 0
			};
			this.state.oldIndex = this.state.index;
		}

		let y = coords.y,
			draggedSetting = this.state.dragged,
			oldIndex = this.state.index,
			moved = false;

		// Update ghost position.
		this.moveGhostEl(coords);

		// Get position in list.
		let prevSetting = this.settings[this.state.index - 1],
			nextSetting = this.settings[this.state.index + 1],
			prevOverdrag = prevSetting?.settingEl.clientHeight * 0.25 || 0,
			nextOverdrag = nextSetting?.settingEl.clientHeight * 0.25 || 0;

		// If ghost is dragged into setting above, swap the settings
		if (prevSetting && y < prevSetting.settingEl.getBoundingClientRect().bottom - prevOverdrag) {
			navigator?.vibrate(100); // Not supported on iOS
			prevSetting.settingEl.insertAdjacentElement('beforebegin', draggedSetting.settingEl);
			this.settings.splice(this.state.index, 1);
			this.settings.splice(--this.state.index, 0, this.state.dragged);
			moved = true;
		}

		// If ghost is dragged into setting below, swap the settings
		if (nextSetting && y > nextSetting.settingEl.getBoundingClientRect().top + nextOverdrag) {
			navigator?.vibrate(100); // Not supported on iOS
			nextSetting.settingEl.insertAdjacentElement('afterend', draggedSetting.settingEl);
			this.settings.splice(this.state.index, 1);
			this.settings.splice(++this.state.index, 0, this.state.dragged);
			moved = true;
		}

		// Only run the callback when the order has been changed.
		if (moved) this.moveCallback?.(this.state.dragged, this.state.index, oldIndex);
	}

	/**
	 * Executed when finishing, detaching ghost element from the DOM.
	 */
	private handleDragEnd(setting: Setting): void {
		let newIndex = this.state?.oldIndex ?? this.settings.indexOf(setting),
			oldIndex = this.state?.index ?? newIndex;

		this.aborter.abort();
		this.aborter = new AbortController();
		this.endCallback?.(setting, newIndex, oldIndex);
		this.ghostEl?.detach();
		this.ghostEl = null;
		this.state = null;
		this.bodyEl.removeClass('is-grabbing');
		setting.settingEl.removeClass('drag-ghost-hidden');
		setting.settingEl.removeAttribute('draggable');
	}
}