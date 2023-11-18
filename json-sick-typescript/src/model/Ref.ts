export const NonMappable = "NonMappable" as const;
export const Mappable = "Mappable" as const;
export type TNul = {
	kind: typeof NonMappable;
	value: 0;
};
export type TBit = {
	kind: typeof NonMappable;
	value: 1;
};
export type TByte = {
	kind: typeof NonMappable;
	value: 2;
};
export type TShort = {
	kind: typeof NonMappable;
	value: 3;
};
export type TInt = {
	kind: typeof Mappable;
	value: 4;
};
export type TLng = {
	kind: typeof Mappable;
	value: 5;
};

export type TBigInt = {
	kind: typeof Mappable;
	value: 6;
};

export type TDbl = {
	kind: typeof Mappable;
	value: 7;
};
export type TFlt = {
	kind: typeof Mappable;
	value: 8;
};

export type TStr = {
	kind: typeof Mappable;
	value: 10;
};

export type TBigDec = {
	kind: typeof Mappable;
	value: 9;
};
export type TArr = {
	kind: typeof Mappable;
	value: 11;
};
export type TObj = {
	kind: typeof Mappable;
	value: 12;
};

export type TRoot = {
	kind: typeof Mappable;
	value: 15;
};
type SickRefKind =
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

export type SickRef = {
	kind: SickRefKind
	ref: number
}
export interface RefMappable<V> {
	remap(value: V, mapping: Map<SickRef, SickRef>): V;
}

export function refRemap(ref: SickRef, remap: (ref: SickRef) => SickRef) {
	switch (ref.kind as unknown as string) {
		case NonMappable: {
			return ref;
		}
		case Mappable: {
			return remap(ref);
		}
	}
}