export function moveArrayItem(arr: unknown[], oldIdx: number, newIdx: number): void {
	arr.splice(newIdx, 0, arr.splice(oldIdx, 1)[0]);
}