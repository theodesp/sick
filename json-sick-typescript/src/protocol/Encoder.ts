function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

type ConvertToBytesFn = (data: number[], isLittleEndian: boolean) => Uint8Array;
const u8sTou8s: ConvertToBytesFn = (data: number[]) => {
  return new Uint8Array(data);
};

export const enum Endian {
  Little = "Little",
  Big = "Big",
}

export interface Encoder {
  get blobSize(): number;
  getBytes(): Uint8Array;
}

class BaseType implements Encoder {
  constructor(
    private width: number,
    private min: number,
    private max: number,
    private toBytesFn: ConvertToBytesFn,
    private value: number,
    private endian: Endian,
  ) {
    this.invariantsCheck(value);
  }

  private invariantsCheck(value: number) {
    assert(
      value >= this.min && value <= this.max,
      `value must be an integer between ${this.min} and ${this.max}`,
    );
    assert(
      Number.isInteger(value),
      `value must be an integer between ${this.min} and ${this.max}`,
    );
  }

  getBytes() {
    return this.toBytesFn([this.value], this.endian === Endian.Little);
  }

  get blobSize() {
    return this.width;
  }
}
class U8Type extends BaseType {
  constructor(value: number, endian = Endian.Little) {
    super(1, 0, 0xff, u8sTou8s, value, endian);
  }
}
export const U8 = (value: number) => new U8Type(value);
