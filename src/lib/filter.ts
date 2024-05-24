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
	// Array of predicate results for each item
	const statuses = await Promise.all(arr.map(predicate));
	// Filter the array based on the predicate results
	return arr.filter((_v, index) => statuses[index]);
}
