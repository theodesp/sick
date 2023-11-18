const getType = (payload: unknown): string =>
	Object.prototype.toString.call(payload).slice(8, -1);

export const isUndefined = (payload: unknown): payload is undefined =>
	typeof payload === "undefined";

export const isNull = (payload: unknown): payload is null => payload === null;

export const isPlainObject = (obj: unknown): obj is Record<string, unknown> => {
	if (!obj || typeof obj !== "object") {
		return false;
	}

	if (obj === Object.prototype) {
		return false;
	}

	if (Object.getPrototypeOf(obj) === null) {
		return true;
	}

	return Object.getPrototypeOf(obj) === Object.prototype;
};

export const isEmptyObject = (
	payload: unknown,
): payload is NonNullable<unknown> =>
	isPlainObject(payload) && Object.keys(payload).length === 0;

export const isArray = (payload: unknown): payload is unknown[] =>
	Array.isArray(payload);

export const isString = (payload: unknown): payload is string =>
	typeof payload === "string";

export const isNumber = (payload: unknown): payload is number =>
	typeof payload === "number" && !isNaN(payload);

export const isBoolean = (payload: unknown): payload is boolean =>
	typeof payload === "boolean";

export const isRegExp = (payload: unknown): payload is RegExp =>
	payload instanceof RegExp;

export const isMap = (payload: unknown): payload is Map<unknown, unknown> =>
	payload instanceof Map;

export const isSet = (payload: unknown): payload is Set<unknown> =>
	payload instanceof Set;

export const isSymbol = (payload: unknown): payload is symbol =>
	getType(payload) === "Symbol";

export const isDate = (payload: unknown): payload is Date =>
	payload instanceof Date && !isNaN(payload.valueOf());

export const isError = (payload: unknown): payload is Error =>
	payload instanceof Error;

export const isNaNValue = (payload: unknown): payload is typeof NaN =>
	typeof payload === "number" && isNaN(payload);

export const isPrimitive = (
	payload: unknown,
): payload is boolean | null | number | string | symbol | undefined =>
	isBoolean(payload) ||
	isNull(payload) ||
	isUndefined(payload) ||
	isNumber(payload) ||
	isString(payload) ||
	isSymbol(payload);

export const isBigint = (payload: unknown): payload is bigint =>
	typeof payload === "bigint";

export const isInfinite = (payload: unknown): payload is number =>
	payload === Infinity || payload === -Infinity;

export type TypedArrayConstructor =
	| Float32ArrayConstructor
	| Float64ArrayConstructor
	| Int8ArrayConstructor
	| Int16ArrayConstructor
	| Int32ArrayConstructor
	| Uint8ArrayConstructor
	| Uint8ClampedArrayConstructor
	| Uint16ArrayConstructor
	| Uint32ArrayConstructor;

export type TypedArray = InstanceType<TypedArrayConstructor>;

export const isTypedArray = (payload: unknown): payload is TypedArray =>
	ArrayBuffer.isView(payload) && !(payload instanceof DataView);

export const isURL = (payload: unknown): payload is URL =>
	payload instanceof URL;
