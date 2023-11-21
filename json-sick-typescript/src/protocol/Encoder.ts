export const enum Endian {
  Little = "Little",
  Big = "Big",
}

export interface Encoder {
  get blobSize(): number;
  getBytes(): Uint8Array;
}

export class I64Type implements Encoder {
  constructor(private value: bigint, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setBigInt64(0, this.value, this.endian === Endian.Little);
    return new Uint8Array(buffer);
  }

  get blobSize() { return 8; }
}


class U8Type implements Encoder {
  constructor(private value: number, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(1);
    new DataView(buffer).setUint8(0, this.value);
    return new Uint8Array(buffer);
  }
  get blobSize() { return 1; }
}
export const Byte = (value: number) => new U8Type(value);

class U16Type implements Encoder {
  constructor(private value: number, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setUint16(0, this.value, this.endian === Endian.Little);
    return new Uint8Array(buffer);
  }
  get blobSize() { return 2; }
}
export const U16 = (value: number, endian = Endian.Little) => new U16Type(value, endian);

class I16Type implements Encoder {
  constructor(private value: number, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, this.value, this.endian === Endian.Little);
    return new Uint8Array(buffer);
  }
  get blobSize() { return 2; }
}
export const Short = (value: number, endian = Endian.Little) => new I16Type(value);

class I32Type implements Encoder {
  constructor(private value: number, private endian = Endian.Little) {}
  getBytes(): Uint8Array {
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setInt32(0, this.value, this.endian === Endian.Little);
    return new Uint8Array(buffer);
  }
  get blobSize() { return 4; }
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
