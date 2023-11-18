import { expect, test, describe } from "vitest";

import { isPlainObject } from "../../src/utils/checks.js";

describe("isPlainObject()", () => {
	// test returns true for plain objects
	test.each([[{}], [{ a: 1 }], [Object.create(null)]])(
		"isPlainObject(%o) -> true",
		(input) => {
			expect(isPlainObject(input)).toBeTruthy();
		},
	);

	// test returns false for non-objects
	test.each([[null], [undefined], [30], ["hello"], [true], [Symbol()]])(
		"isPlainObject(%o) -> false",
		(input) => {
			expect(isPlainObject(input)).toBeFalsy();
		},
	);

	// test returns false for non-plain objects
	test.each([[[]], [new Date()], [/hello/], () => {}, [Object.prototype]])(
		"isPlainObject(%o) -> false",
		(input) => {
			expect(isPlainObject(input)).toBeFalsy();
		},
	);
});
