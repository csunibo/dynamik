/**
 * Filters an array asynchronously using a predicate function.
 * @param arr The array to filter
 * @param predicate The predicate function to use
 * @returns The filtered array
 */
export async function filterAsync<T>(
	arr: T[],
	predicate: (t: T) => Promise<boolean>
): Promise<T[]> {
	const result = Array<T>(arr.length);
	for (const item of arr) {
		if (await predicate(item)) {
			result.push(item);
		}
	}
	return result;
}
