export type TNul = {
	kind: 0,
	value: number
}
export type TBit = {
	kind: 1,
	value: number
}

export type TByte = {
	kind: 2,
	value: number
}

export type TShort = {
	kind: 3,
	value: number
}

export type TInt = {
	kind: 4,
	value: number
}
export type TLng = {
	kind: 5,
	value: number
}

export type TBigInt = {
	kind: 6,
	value: number
}

export type TDbl = {
	kind: 7,
	value: number
}
export type TFlt = {
	kind: 8,
	value: number
}
export type TBigDec = {
	kind: 9,
	value: number
}
export type TStr = {
	kind: 10,
	value: number
}
export type TArr = {
	kind: 11,
	value: number
}
export type TObj = {
	kind: 12,
	value: number
}

export type TRoot = {
	kind: 15,
	value: number
}

export type ObjEntry = {
	key: number;
	ref: SickRef
}
export type SickRoot = ObjEntry;

export type SickRef = TArr | TBigDec | TBigInt | TBit | TByte | TDbl | TFlt | TInt | TLng | TNul | TObj | TRoot | TShort | TStr;

export interface RefMappable<V> {
	remap(value: V, mapping: Map<SickRef, SickRef>): V;
}

export function refRemap(ref: SickRef, remap: (ref: SickRef) => SickRef) {
	switch (ref.kind) {
		case 0: case 1: case 2:case 3:
			return remap(ref);
		default: {
			return ref
		}
	}
}

