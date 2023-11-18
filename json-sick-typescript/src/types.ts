export type Class = { new (...args: unknown[]): unknown };

export type PrimitiveJSONValue = boolean | null | number | string | undefined;

export type JSONValue = JSONArray | JSONObject | PrimitiveJSONValue;

export interface JSONArray extends Array<JSONValue> {}

export interface JSONObject {
	[key: string]: JSONValue;
}

export type SickJSONValue = JSONValue | SickJSONArray | SickJSONObject;
export interface SickJSONObject {
	[key: string]: SickJSONValue;
}
export interface SickJSONArray extends Array<SickJSONValue> {}

export type SerializableJSONValue =
	| Date
	| Map<SickJSONValue, SickJSONValue>
	| RegExp
	| Set<SickJSONValue>
	| bigint
	| symbol
	| undefined;

export interface SickJSONResult {
	json: JSONValue;
}
