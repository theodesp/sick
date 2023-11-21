import { describe, expect, test } from "vitest";

import { Byte, Double, Float, Int, Long, Short } from "../../src/protocol/Encoder.js";

const expectEqualBuffers = (buffer: Uint8Array, expected: Array<number>) => {
    expect(buffer.join(', ')).to.equal(expected.join(', '));
  }


describe("Encoder functions", () => {
    describe('Byte encoder', () => {
        test('it stores a u8 byte with the right representation', () => {
            const data = 4;
            const converted = Byte(data);
            expect.assertions(2);

            expect(converted.blobSize).toBe(1);
            expectEqualBuffers(converted.getBytes(), [0x4]);
        });
        test('it stores a Short number (i16) with the right representation', () => {
            const data = -2;
            const converted = Short(data);
            expect.assertions(2);

            expect(converted.blobSize).toBe(2);
            expectEqualBuffers(converted.getBytes(), [254, 255]);
        })
        test('it stores a Int number (i32) with the right representation', () => {
            const data = 50000;
            const converted = Int(data);
            expect.assertions(2);

            expect(converted.blobSize).toBe(4);
            expectEqualBuffers(converted.getBytes(), [80, 195, 0, 0]);
        })
        test('it stores a Long number (i64 bigint) with the right representation', () => {
            const data = BigInt(12312414235245234);
            const converted = Long(data);
            expect.assertions(2);

            expect(converted.blobSize).toBe(8);
            expectEqualBuffers(converted.getBytes(), [178, 186, 209, 84, 19, 190, 43, 0]);
        })
        test('it stores a Float number (f32) with the right representation', () => {
            const data = Math.PI;
            const converted = Float(data);
            expect.assertions(2);

            expect(converted.blobSize).toBe(4);
            expectEqualBuffers(converted.getBytes(), [219, 15, 73, 64]);
        })
        test('it stores a Double number (f64) with the right representation', () => {
            const data = Math.PI;
            const converted = Double(data);
            expect.assertions(2);

            expect(converted.blobSize).toBe(8);
            expectEqualBuffers(converted.getBytes(), [24, 45, 68, 84, 251, 33, 9, 64]);
        })
    })
});