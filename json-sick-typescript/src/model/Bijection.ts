/**
 * An ADT for one to one mapping of number to V types
 */
export class Bijection<V> {
	constructor(
		private readonly forward = new Map<number, V>(),
		private readonly reverse = new Map<V, number>(),
		private readonly counters = new Map<number, number>(),
	) {}

	add(value: V): number {
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

	freq(key: number): number {
		return this.counters.get(key)!;
	}

	fromList(content: [idx: number, value: V, freq: number][]): Bijection<V> {
		const data = content.map((v) => [v[0], v[1]] as const);
		const revData = content.map((v) => [v[1], v[0]] as const);
		const freq = content.map((v) => [v[0], v[2]] as const);
		return new Bijection(new Map(data), new Map(revData), new Map(freq));
	}

	get(key: number): V | undefined {
		return this.forward.get(key);
	}

	reverseGet(value: V): number | undefined {
		return this.reverse.get(value);
	}

	rewriteMap(mapper: <T>(src: T) => T): Bijection<V> {
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

	get isEmpty(): boolean {
		return this.forward.size > 0;
	}

	get size(): number {
		return this.forward.size;
	}
}
