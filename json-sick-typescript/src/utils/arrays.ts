export const flattenU8Array = (arrays: Uint8Array[]) => {
	const result = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
	let i = 0;
	arrays.forEach((a) => {
		result.set(a, i);
		i += a.length;
	});
	return result;
};

export const computeOffsets = (arrays: Uint8Array[], initial: number) => {
	const counts = arrays.map((a) => a.length);
	const arr = counts.reduce(
		(acc, curr, i) => {
			acc.push(acc[i] + curr);
			return acc;
		},
		[initial],
	);
	arr.pop();
	return Uint8Array.from(arr);
};
