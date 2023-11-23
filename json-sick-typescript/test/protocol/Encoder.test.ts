import { describe, expect, test } from "vitest";

import { SickRef } from "../../src/model/Ref.js";
import { Byte, Double, Float, Int, Long, Ref, Short } from "../../src/protocol/Encoder.js";

export const expectEqualBuffers = (buffer: Uint8Array, expected: Array<number>) => {
    expect(buffer.join(', ')).to.equal(expected.join(', '));
}

describe("Encoder functions", () => {
    test('it stores a u8 byte with the right representation', () => {
        const data = 4;
        const converted = Byte(data);

        expectEqualBuffers(converted, [0x4]);
    });
    test('it stores a Short number (i16) with the right representation', () => {
        const data = -2;
        const converted = Short(data);

        expectEqualBuffers(converted, [254, 255]);
    })
    test('it stores a Int number (i32) with the right representation', () => {
        const data = 50000;
        const converted = Int(data);

        expectEqualBuffers(converted, [80, 195, 0, 0]);
    })
    test('it stores a Long number (i64 bigint) with the right representation', () => {
        const data = BigInt(12312414235245234);
        const converted = Long(data);

        expectEqualBuffers(converted, [178, 186, 209, 84, 19, 190, 43, 0]);
    })
    test('it stores a Float number (f32) with the right representation', () => {
        const data = Math.PI;
        const converted = Float(data);

        expectEqualBuffers(converted, [219, 15, 73, 64]);
    })
    test('it stores a Double number (f64) with the right representation', () => {
        const data = Math.PI;
        const converted = Double(data);

        expectEqualBuffers(converted, [24, 45, 68, 84, 251, 33, 9, 64]);
    })
    test('it stores a Ref type with the right representation', () => {
        const ref: SickRef = {
            kind: 1, // TByte,
            value: 8
        };
        const converted = Ref(ref);

        expectEqualBuffers(converted, [1, 8, 0, 0, 0]);
    })
});