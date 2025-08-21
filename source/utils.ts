export function listify(arr: string[]): string {
	return arr.map(str => str + ", ").join("").trimEnd();
}