function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

type ConvertToBytesFn = (data: number[], isLittleEndian: boolean) => Uint8Array;
const u8sTou8s: ConvertToBytesFn = (data: number[]) => {
  return new Uint8Array(data);
};
const u16sTou8s = (data: number[], isLittleEndian: boolean) => {
  const stride = 2;
  const buffer = new Uint8Array(data.length * stride);
  let i = 0;
  for (const n of data) {
    if (isLittleEndian) {
      buffer[i+0] = n & 0xff;
      buffer[i+1] = (n >> 8) & 0xff;
    } else {
      buffer[i+1] = n & 0xff;
      buffer[i+0] = (n >> 8) & 0xff;
    }
    i += stride;
  }
  return buffer;
}

const u32sTou8s = (data: number[], isLittleEndian: boolean) => {
  const stride = 4;
  const buffer = new Uint8Array(data.length * stride);
  let i = 0;
  for (const n of data) {
    if (isLittleEndian) {
      buffer[i+0] = n & 0xff;
      buffer[i+1] = (n >> 8) & 0xff;
      buffer[i+2] = (n >> 16) & 0xff;
      buffer[i+3] = (n >> 24) & 0xff;
    } else {
      buffer[i+3] = n & 0xff;
      buffer[i+2] = (n >> 8) & 0xff;
      buffer[i+1] = (n >> 16) & 0xff;
      buffer[i+0] = (n >> 24) & 0xff;
    }
    i += stride;
  }
  return buffer;
}

const u64sTou8s = (data: bigint[], isLittleEndian: boolean) => {
  const stride = 8;
  const buffer = new Uint8Array(data.length * stride);
  let i = 0;
  for (const n of data) {
    if (isLittleEndian) {
      buffer[i+0] = Number(n & 0xffn);
      buffer[i+1] = Number((n >> 8n) & 0xffn);
      buffer[i+2] = Number((n >> 16n) & 0xffn);
      buffer[i+3] = Number((n >> 24n) & 0xffn);
      buffer[i+4] = Number((n >> 32n) & 0xffn);
      buffer[i+5] = Number((n >> 40n) & 0xffn);
      buffer[i+6] = Number((n >> 48n) & 0xffn);
      buffer[i+7] = Number((n >> 56n) & 0xffn);
    } else {
      buffer[i+7] = Number(n & 0xffn);
      buffer[i+6] = Number((n >> 8n) & 0xffn);
      buffer[i+5] = Number((n >> 16n) & 0xffn);
      buffer[i+4] = Number((n >> 24n) & 0xffn);
      buffer[i+3] = Number((n >> 32n) & 0xffn);
      buffer[i+2] = Number((n >> 40n) & 0xffn);
      buffer[i+1] = Number((n >> 48n) & 0xffn);
      buffer[i+0] = Number((n >> 56n) & 0xffn);
    }
    i += stride;
  }
  return buffer;
}

const normalise64 = (n: bigint) => {
  return n < 0n
    ? 0xffffffffffffffffn + n + 1n
    : n;
};

export const enum Endian {
  Little = "Little",
  Big = "Big",
}

export interface Encoder {
  get blobSize(): number;
  getBytes(): Uint8Array;
}

class BaseEncoderType implements Encoder {
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

export class I64Type implements Encoder {
  constructor(private value: bigint, private endian = Endian.Little) {
    this.invariantsCheck(value);
  }

  private invariantsCheck(value: bigint) {
    const min = -0x8000000000000000n;
    const max =  0x7fffffffffffffffn;
    assert(
      value >= min && value <= max,
      `value must be an integer between ${min.toString()} and ${max.toString()}`
    );
  }

  getBytes() {
    return u64sTou8s([normalise64(this.value)], this.endian === Endian.Little);
  }

  get blobSize() { return 8; }
}


class U8Type extends BaseEncoderType {
  constructor(value: number, endian = Endian.Little) {
    super(1, 0, 0xff, u8sTou8s, value, endian);
  }
}
export const Byte = (value: number) => new U8Type(value);

class U16Type extends BaseEncoderType {
  constructor(value: number, endian = Endian.Little) {
    super(2, 0, 0xffff, u16sTou8s, value, endian);
  }
}
export const U16 = (value: number, endian = Endian.Little) => new U16Type(value, endian);

class I16Type extends BaseEncoderType {
  constructor(value: number, endian = Endian.Little) {
    super(2, -0x8000, 0x7fff, u16sTou8s, value, endian);
  }
}
export const Short = (value: number, endian = Endian.Little) => new I16Type(value);

class I32Type extends BaseEncoderType {
  constructor(value: number, endian = Endian.Little) {
    super(4, -0x80000000, 0x7fffffff, u32sTou8s, value, endian);
  }
}
export const Int = (value: number, endian = Endian.Little) => new I32Type(value, endian);
export const Long = (value: bigint, endian = Endian.Little) => new I64Type(value, endian);

export class F32Type implements Encoder {
  constructor(private value: number, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, this.value, this.endian === Endian.Little);
    return new Uint8Array(buffer);
  }
  get blobSize() { return 4; }
}
export const Float = (value: number, endian = Endian.Little) => new F32Type(value, endian);

export class F64Type implements Encoder {
  constructor(private value: number, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, this.value, this.endian === Endian.Little);
    return new Uint8Array(buffer);
  }
  get blobSize() { return 8; }
}
export const Double = (value: number, endian = Endian.Little) => new F64Type(value, endian);
