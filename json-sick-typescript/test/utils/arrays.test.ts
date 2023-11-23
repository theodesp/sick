import { describe, test } from "vitest";

import { computeOffsets } from "../../src/utils/arrays.js";
import { expectEqualBuffers } from "../protocol/Encoder.test.js";

describe("computeOffsets()", () => {
    test.each([
        [
            [Uint8Array.from([1]), Uint8Array.from([4,5,6,7,8]), Uint8Array.from([2,3])],
            [0, 1, 6],
        ]])(
        "computeOffsets(%o) -> %o",
		(input: Uint8Array[], expected: number[]) => {
			expectEqualBuffers(computeOffsets(input, 0), expected);
		},
	);
});