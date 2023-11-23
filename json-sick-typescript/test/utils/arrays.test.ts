import { describe, test } from "vitest";

import { computeOffsets } from "../../src/utils/arrays.js";
import { expectEqualBuffers } from "../protocol/Encoder.test.js";

describe("computeOffsets()", () => {
	test.each([
		[
			[[1], [4, 5, 6, 7, 8], [2, 3]],
			[0, 1, 6],
		],
	])("computeOffsets(%o) -> %o", (input, expected) => {
		expectEqualBuffers(
			computeOffsets(
				input.map((v) => Uint8Array.from(v)),
				0,
			),
			expected,
		);
	});
});
