import 'obsidian';

declare module 'obsidian' {
	interface AbstractDraggable<T extends string> {
		icon?: string;
		source?: string;
		title: string;
		type: T;
	}

	/**
	 * Draggable object that may contain file, folder, or link.
	 */
	type Draggable =
		| DraggableBookmark
		| DraggableFile
		| DraggableFiles
		| DraggableFolder
		| DraggableLink;

	interface DraggableBookmark extends AbstractDraggable<'bookmark'> {
		items: Array<BookmarkTreeItem | BookmarkGroupTreeItem>;
	}

	interface DraggableFile extends AbstractDraggable<'file'> {
		file?: TFile;
	}

	interface DraggableFiles extends AbstractDraggable<'files'> {
		files?: TAbstractFile[];
	}

	interface DraggableFolder extends AbstractDraggable<'folder'> {
		folder?: TFolder;
	}

	interface DraggableLink extends AbstractDraggable<'link'> {
		file?: TFile;
		linkText?: string;
		sourcePath?: string;
	}

	/**
	 * @typeonly
	 */
	class DragManager {
		draggable: Draggable | null;
		ghostEl: HTMLElement | null;
		handleDrag(el: HTMLElement, draggableGetter: (event: DragEvent) => Draggable | null): void;
		/**
		 * Attach dragover and drop handler to an element.
		 */
		handleDrop(
			el: HTMLElement,
			dropHandler: (event: DragEvent, draggable: Draggable | null, isOver: boolean) => DropResult | null,
			draggable?: boolean
		): void;
		onDragStart(evt: DragEvent, draggable: Draggable): void;
	}

	interface DropResult {
		action: string | null;
		dropEffect: 'none' | 'copy' | 'link' | 'move';
		hoverClass?: string;
		hoverEl?: HTMLElement | null;
	}
}