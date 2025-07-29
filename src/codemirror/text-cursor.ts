import { Line, Text, type TextLeaf, type TextNode } from '@codemirror/state';

/**
 * Line location in respect of its parent {@link Text | text}.
 */
interface LineAddressPart {
	index: number;
	parent: TextNode | TextLeaf;
}

/**
 * Full line address among its {@link Text | ancestors}.
 */
type LineAddress = LineAddressPart[];

/**
 * Check whether it's a leaf branch. Leaf branch is a innermost text
 * branch.
 */
function isTextLeaf(doc: Text): doc is TextLeaf {
	return 'text' in doc && doc.text instanceof Array;
}

/**
 * Check whether it's a node branch. Node branch consists of another
 * branches.
 */
function isTextNode(doc: Text): doc is TextNode {
	return doc.children !== null;
}

/**
 * Get full line address from the given offset.
 * 
 * @param doc Can be a node branch or a leaf branch.
 * @param offset Offset at which the line located.
 * @returns A full line address and the targeted line.
 */
function getLineAddressAt(doc: Text, offset: number): { address: LineAddress, line: Line } {
	let parent = doc,
		address: LineAddress = [],
		lineNum = 0,
		lineStr = '',
		passedLen = 0;

	// Offset must be in the document range.
	if (offset < 0 || offset > parent.length) throw RangeError();

	// Locating the leaf branch where the offset is located at.
	while (isTextNode(parent)) {
		let branches = parent.children;
		for (let i = 0; i < branches.length; i++) {
			let curBranch = branches[i];
			// Get the outer address.
			if (offset >= passedLen && offset <= passedLen + curBranch.length) {
				address.push({ parent, index: i });
				parent = curBranch;
				break;
			}
			passedLen += curBranch.length + 1;
			lineNum += curBranch.lines;
		}
	}

	// Must be ended with a leaf branch.
	if (!isTextLeaf(parent)) throw TypeError();

	// Locating the targeted line.
	for (let i = 0; i < parent.text.length; i++) {
		let curLineStr = parent.text[i];
		lineNum++;
		if (offset >= passedLen && offset <= passedLen + curLineStr.length) {
			address.push({ parent, index: i });
			lineStr = curLineStr;
			break;
		}
		passedLen += curLineStr.length + 1;
	}

	let line = new ILine(
		passedLen,
		passedLen + lineStr.length,
		lineNum,
		lineStr
	);
	return { address, line };
}


/**
 * Mocked {@link Line} class.
 */
class ILine extends Line {
	public readonly from: number;
	public readonly to: number;
	public readonly number: number;
	public readonly text: string;

	constructor(from: number, to: number, number: number, text: string) {
		super();
		this.from = from;
		this.to = to;
		this.number = number;
		this.text = text;
	}
}

/**
 * Cursor implementation for {@link Text}, returning current line and its
 * address as the result.
 */
export class TextCursor {
	public address: LineAddress;
	public curLine: Line;
	public doc: Text;

	private constructor() {}

	/**
	 * Try to go to the next line.
	 * @returns True if succeeds.
	 */
	public next(): boolean {
		for (let deep = this.address.length - 1; deep >= 0; deep--) {
			let { parent, index } = this.address[deep],
				branches = isTextLeaf(parent) ? parent.text : parent.children;
			if (index + 1 < branches.length) {
				this.address[deep].index = ++index;
				if (this.address.splice(deep + 1).length) while (isTextNode(parent)) {
					parent = parent.children[index] as TextNode | TextLeaf;
					index = 0;
					this.address.push({ parent, index });
				}
				if (!isTextLeaf(parent)) throw TypeError("TextLeaf not found!");
				let length = parent.text[index].length,
					from = this.curLine.to + 1;
				this.curLine = new ILine(
					from,
					from + length,
					this.curLine.number + 1,
					parent.text[index]
				);
				return true;
			}
		}
		return false;
	}

	/**
	 * Try to go to the previous line.
	 * @returns True if succeeds.
	 */
	public prev(): boolean {
		for (let deep = this.address.length - 1; deep >= 0; deep--) {
			if (this.address[deep].index > 0) {
				this.address[deep].index--;
				let { parent, index } = this.address[deep];
				if (this.address.splice(deep + 1).length && isTextNode(parent)) while (true) {
					let isLeaf: boolean;
					parent = (parent as TextNode).children[index] as TextNode | TextLeaf;
					if (isTextLeaf(parent)) {
						isLeaf = true;
						index = parent.text.length - 1;
					} else {
						isLeaf = false;
						index = parent.children.length - 1;
					}
					this.address.push({ parent, index });
					if (isLeaf) break;
				}
				if (!isTextLeaf(parent)) throw TypeError("TextLeaf not found!");
				let length = parent.text[index].length,
					to = this.curLine.from - 1;
				this.curLine = new ILine(
					to - length,
					to,
					this.curLine.number - 1,
					parent.text[index]
				);
				return true;
			}
		}
		return false;
	}

	/**
	 * Go to the line where it's located at the given offset.
	 */
	public goto(offset: number): this {
		if (offset < this.curLine.from) while (offset < this.curLine.from) this.prev();
		else if (offset > this.curLine.to) while (offset > this.curLine.to) this.next();
		return this;
	}

	/**
	 * Go to the line at the given index.
	 */
	public gotoLine(linePos: number): this {
		if (linePos < this.curLine.number) while (this.curLine.number != linePos && this.prev());
		else if (linePos > this.curLine.number) while (this.curLine.number != linePos && this.next());
		return this;
	}

	/**
	 * Go to the last line of the document.
	 */
	public gotoLast(): TextCursor {
		this.address.splice(1);
		let { parent, index } = this.address[0],
			root = parent;
		while (isTextNode(parent)) {
			index = parent.children.length - 1;
			if (root !== parent) this.address.push({ parent, index });
			else this.address[0].index = index;
			parent = parent.children[index] as TextNode | TextLeaf;
		}
		index = parent.text.length - 1;
		if (root !== parent) this.address[0].index = index;
		else this.address.push({ parent, index });
		let lineStr = parent.text[index];
		this.curLine = {
			from: root.length - lineStr.length,
			to: root.length,
			text: lineStr,
			number: root.lines,
			length: lineStr.length
		};
		return this;
	}

	/**
	 * Clone current line address.
	 */
	public cloneAddress(): LineAddress {
		let cloned: LineAddress = [];
		for (let i = 0; i < this.address.length; i++) {
			let part = this.address[i];
			cloned.push({ ...part });
		}
		return cloned;
	}

	/**
	 * Clone current line instance.
	 */
	public cloneLine(): Line {
		return new ILine(
			this.curLine.from,
			this.curLine.to,
			this.curLine.number,
			this.curLine.text
		);
	}


	/**
	 * Get line at offset where it's located at.
	 */
	public getLineAt(offset: number): Line {
		let anchorAddr = this.cloneAddress(),
			anchorLine = this.cloneLine();

		this.goto(offset);
		let targetLine = this.curLine;
		this.address = anchorAddr;
		this.curLine = anchorLine;

		return targetLine;
	}

	/**
	 * Create a text cursor started at line located at the given offset.
	 */
	public static atOffset(doc: Text, offset: number): TextCursor {
		let { address, line: curLine } = getLineAddressAt(doc, offset),
			cursor = new TextCursor();
		cursor.address = address;
		cursor.curLine = curLine;
		cursor.doc = doc;
		return cursor;
	}
}