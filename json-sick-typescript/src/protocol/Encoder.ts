import { ObjEntry, SickRef, SickRoot } from "../model/Ref.js";
import { flattenU8Array } from "../utils/arrays.js";
import { bigIntToU8Array } from "../utils/bigInt.js";

export const enum Endian {
	Little = "Little",
	Big = "Big",
}

export interface Encoder<T> {
	getBytes(value: T): Uint8Array;
}

export interface FixedEncoder<T> extends Encoder<T> {
	get blobSize(): number;
}
export interface VarEncoder<T> extends Encoder<T> {}

export interface ArrayEncoder<T> extends Encoder<T[]> {
	get elementSize(): number;
}

export interface VarArrayByteEncoder<T> extends Encoder<T[]> {}

class I64Type implements FixedEncoder<bigint> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 8;
	}

	getBytes(value: bigint) {
		const buffer = new ArrayBuffer(8);
		new DataView(buffer).setBigInt64(0, value, this.endian === Endian.Little);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return I64Type.blobSize;
	}
}

class U8Type implements FixedEncoder<number> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 1;
	}
	getBytes(value: number) {
		const buffer = new ArrayBuffer(1);
		new DataView(buffer).setUint8(0, value);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return U8Type.blobSize;
	}
}
export const Byte = (value: number) => new U8Type().getBytes(value);

class U16Type implements FixedEncoder<number> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 2;
	}
	getBytes(value: number) {
		const buffer = new ArrayBuffer(2);
		new DataView(buffer).setUint16(0, value, this.endian === Endian.Little);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return U16Type.blobSize;
	}
}
export const U16 = (value: number, endian = Endian.Little) =>
	new U16Type(endian).getBytes(value);

class I16Type implements FixedEncoder<number> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 2;
	}
	getBytes(value: number): Uint8Array {
		const buffer = new ArrayBuffer(2);
		new DataView(buffer).setInt16(0, value, this.endian === Endian.Little);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return I16Type.blobSize;
	}
}
export const Short = (value: number, endian = Endian.Little) =>
	new I16Type(endian).getBytes(value);

class I32Type implements FixedEncoder<number> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 4;
	}
	getBytes(value: number): Uint8Array {
		const buffer = new ArrayBuffer(4);
		new DataView(buffer).setInt32(0, value, this.endian === Endian.Little);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return I32Type.blobSize;
	}
}
export const Int = (value: number, endian = Endian.Little) =>
	new I32Type(endian).getBytes(value);
export const Long = (value: bigint, endian = Endian.Little) =>
	new I64Type(endian).getBytes(value);

class F32Type implements FixedEncoder<number> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 4;
	}
	getBytes(value: number): Uint8Array {
		const buffer = new ArrayBuffer(4);
		new DataView(buffer).setFloat32(0, value, this.endian === Endian.Little);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return F32Type.blobSize;
	}
}
export const Float = (value: number, endian = Endian.Little) =>
	new F32Type(endian).getBytes(value);

export class F64Type implements FixedEncoder<number> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 8;
	}
	getBytes(value: number): Uint8Array {
		const buffer = new ArrayBuffer(8);
		new DataView(buffer).setFloat64(0, value, this.endian === Endian.Little);
		return new Uint8Array(buffer);
	}
	get blobSize() {
		return F64Type.blobSize;
	}
}
export const Double = (value: number, endian = Endian.Little) =>
	new F64Type(endian).getBytes(value);

export class RefType implements FixedEncoder<SickRef> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 1 + I32Type.blobSize;
	}
	getBytes(value: SickRef): Uint8Array {
		const kindBytes = Byte(value.kind);
		const valueBytes = Int(value.value);
		const result = new Uint8Array(kindBytes.length + valueBytes.length);
		result.set(kindBytes);
		result.set(valueBytes, kindBytes.length);
		return result;
	}
	get blobSize() {
		return RefType.blobSize;
	}
}
export const Ref = (ref: SickRef, endian = Endian.Little) =>
	new RefType(endian).getBytes(ref);

export class ObjType implements FixedEncoder<ObjEntry> {
	constructor(private endian = Endian.Little) {}
	static get blobSize() {
		return 1 + RefType.blobSize;
	}
	getBytes(value: ObjEntry): Uint8Array {
		const keyBytes = Byte(value.key);
		const refBytes = Ref(value.ref);
		const result = new Uint8Array(keyBytes.length + refBytes.length);
		result.set(keyBytes);
		result.set(refBytes, keyBytes.length);
		return result;
	}
	get blobSize() {
		return ObjType.blobSize;
	}
}
export const Obj = (ref: ObjEntry, endian = Endian.Little) =>
	new ObjType(endian).getBytes(ref);
export const Root = (root: SickRoot, endian = Endian.Little) =>
	new ObjType(endian).getBytes(root);

export class ArrayByteType<T> implements ArrayEncoder<T> {
	constructor(
		private encoder: FixedEncoder<T>,
		private endian = Endian.Little,
	) {}
	getBytes(value: T[]): Uint8Array {
		const countBytes = Int(value.length);
		const elementBytes = flattenU8Array(
			value.map((e) => this.encoder.getBytes(e)),
		);
		const result = new Uint8Array(countBytes.length + elementBytes.length);
		result.set(countBytes);
		result.set(elementBytes, countBytes.length);
		return result;
	}
	get elementSize() {
		return this.encoder.blobSize;
	}
}

export const RefList = (refs: SickRef[], endian = Endian.Little) =>
	new ArrayByteType(new RefType(endian), endian).getBytes(refs);
export const RootList = (roots: SickRoot[], endian = Endian.Little) =>
	new ArrayByteType(new ObjType(endian), endian).getBytes(roots);

export class StringType implements VarEncoder<string> {
	getBytes(value: string): Uint8Array {
		return new TextEncoder().encode(value);
	}
}
export const String = (value: string) => new StringType().getBytes(value);

class BigIntType implements VarEncoder<bigint> {
	getBytes(value: bigint): Uint8Array {
		return bigIntToU8Array(value);
	}
}
export const BigInt = (value: bigint) => new BigIntType().getBytes(value);

export class VarArrayByteType<T> implements VarArrayByteEncoder<T> {
	constructor(private encoder: FixedEncoder<T>) {}
	getBytes(value: T[]): Uint8Array {
		const elements = flattenU8Array(value.map((e) => this.encoder.getBytes(e)));
		const offsets = [];
		const header = [];
		const lastOffSet = 0;
		// Header + lastOffSet + elements
		return [];
	}
}
