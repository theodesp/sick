/**
 * An ADT for one to one mapping of number to V types
 */
export class Bijection<V> {
	constructor(
		private readonly forward = new Map<number, V>(),
		private readonly reverse = new Map<V, number>(),
		private readonly counters = new Map<number, number>(),
	) {}

	add(value: V) {
		if (this.reverse.has(value)) {
			const ret = this.reverse.get(value)!;
			this.counters.set(ret, this.counters.get(ret)! + 1);
			return ret;
		}

		const idx = this.forward.size;
		this.forward.set(idx, value);
		this.reverse.set(value, idx);
		this.counters.set(idx, 1);
		return idx;
	}

	all() {
		const entries = this.reverse.entries();
		const result = [] as unknown as [[number, [V, number]]];
		for (const entry of entries) {
			const [v, k] = entry;
			result.push([k, [v, this.counters.get(k)!]])
		}
		return new Map<number, [V, number]>(result);
	}

	freq(key: number) {
		return this.counters.get(key)!;
	}

	fromList(content: [idx: number, value: V, freq: number][]) {
		const data = content.map((v) => [v[0], v[1]] as const);
		const revData = content.map((v) => [v[1], v[0]] as const);
		const freq = content.map((v) => [v[0], v[2]] as const);
		return new Bijection(new Map(data), new Map(revData), new Map(freq));
	}

	get(key: number) {
		return this.forward.get(key);
	}

	reverseGet(value: V) {
		return this.reverse.get(value);
	}

	rewriteMap(mapper: (src: V) => V) {
		const newRev = Array.from(this.reverse.entries()).map((v) => {
			return [mapper(v[0]), v[1]] as const;
		});

		const newData = Array.from(this.forward.entries()).map((v) => {
			return [v[0], mapper(v[1])] as const;
		});
		return new Bijection(
			new Map(newData),
			new Map(newRev),
			new Map(this.counters),
		);
	}

	get isEmpty() {
		return this.forward.size > 0;
	}

	get size() {
		return this.forward.size;
	}
}
