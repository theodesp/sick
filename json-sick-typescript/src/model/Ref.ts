export type NonMappable = "NonMappable";
export type Mappable = "Mappable";

export type SickRefKind = Mappable | NonMappable;
export type MakeRefType<T extends SickRefKind, N extends number> = {
	kind: T,
	value: N
}

export type TNul = MakeRefType<NonMappable, 0>;
export type TBit = MakeRefType<NonMappable, 1>;
export type TByte = MakeRefType<NonMappable, 2>;
export type TShort = MakeRefType<NonMappable, 3>;
export type TInt = MakeRefType<Mappable, 4>;
export type TLng = MakeRefType<Mappable, 5>;
export type TBigInt = MakeRefType<Mappable, 6>;
export type TDbl = MakeRefType<Mappable, 7>;
export type TFlt = MakeRefType<Mappable, 8>;
export type TBigDec = MakeRefType<Mappable, 9>;
export type TStr = MakeRefType<Mappable, 10>;
export type TArr = MakeRefType<Mappable, 11>;
export type TObj = MakeRefType<Mappable, 12>;
export type TRoot = MakeRefType<Mappable, 15>;

export type SickRef =
	| TBigDec
	| TBigInt
	| TBit
	| TByte
	| TDbl
	| TFlt
	| TInt
	| TLng
	| TNul
	| TRoot
	| TShort;
export interface RefMappable<V> {
	remap(value: V, mapping: Map<SickRef, SickRef>): V;
}

export function refRemap(ref: SickRef, remap: (ref: SickRef) => SickRef) {
	switch (ref.kind) {
		case "NonMappable": {
			return ref;
		}
		case "Mappable": {
			return remap(ref);
		}
	}
}