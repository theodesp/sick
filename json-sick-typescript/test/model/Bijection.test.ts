import { beforeEach, describe, expect, test } from "vitest";

import { Bijection } from "../../src/model/Bijection.js";

describe("Bijection<V>", () => {
    let sut: Bijection<number>;
    beforeEach(() => {
        sut = new Bijection();
    });
    describe('.add()', () => {
        test('empty set checks', () => {
            expect.assertions(3);

            expect(sut.freq(1)).toBe(undefined);
            expect(sut.isEmpty).toBeTruthy();
            expect(sut.size).toBe(0);
        })
        test('adds new value and updates counters', () => {
            const key = sut.add(10);
            expect.assertions(3);

            expect(sut.freq(key)).toBe(1);
            expect(sut.isEmpty).toBeFalsy();
            expect(sut.size).toBe(1);
        })
        test('returns existing value and updates counters', () => {
            const first = sut.add(10);
            const second = sut.add(10);
            expect.assertions(4);

            expect(sut.freq(first)).toBe(2);
            expect(sut.freq(second)).toBe(2);
            expect(sut.isEmpty).toBeFalsy();
            expect(sut.size).toBe(1);
        })
    });
    describe('.fromList()', () => {
        test('creates a new instance from list', () => {
            const content: [idx: number, value: number, freq: number][] = [
                // (index, value, frequency)
                [0, 10, 1],
                [1, 5, 2]
            ];
            sut = sut.fromList(content);
            expect.assertions(4);

            expect(sut.freq(content[0][0])).toBe(1);
            expect(sut.freq(content[1][0])).toBe(2);
            expect(sut.isEmpty).toBeFalsy();
            expect(sut.size).toBe(2);
        })
    })
    describe('.rewriteMap()', () => {
        test('creates a new instance using a re-map function', () => {
            // adds one to all values
            const addOne = (v) => v + 1;
            const first = sut.add(1);
            const second = sut.add(2);
            const third = sut.add(3);
            console.debug(sut);
            sut = sut.rewriteMap(addOne);
            console.debug(sut);
            expect.assertions(11);
            
            expect(sut.freq(first)).toBe(1);
            expect(sut.freq(second)).toBe(1);
            expect(sut.freq(third)).toBe(1);

            expect(sut.get(first)).toBe(2);
            expect(sut.get(second)).toBe(3);
            expect(sut.get(third)).toBe(4);

            expect(sut.reverseGet(sut.get(first) as number)).toBe(first);
            expect(sut.reverseGet(sut.get(second) as number)).toBe(second);
            expect(sut.reverseGet(sut.get(third) as number)).toBe(third);
            expect(sut.isEmpty).toBeFalsy();
            expect(sut.size).toBe(3);
        })
        
    })
});
