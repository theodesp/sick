export * from "./errors.js";

// --- sync --

import type { SickJSONResult, SickJSONValue } from "./types.js";

export default class SickJSON {
	static deserialize = SickJSON.defaultInstance.deserialize.bind(
		SickJSON.defaultInstance,
	);

	static parse = SickJSON.defaultInstance.parse.bind(SickJSON.defaultInstance);
	static serialize = SickJSON.defaultInstance.serialize.bind(
		SickJSON.defaultInstance,
	);

	static stringify = SickJSON.defaultInstance.stringify.bind(
		SickJSON.defaultInstance,
	);
	private static defaultInstance = new SickJSON();
	deserialize<T = unknown>(payload: SickJSONResult): T {
		const result = {} as any;
		return result;
	}
	parse<T = unknown>(string: string): T {
		return this.deserialize(JSON.parse(string));
	}
	serialize(object: SickJSONValue): SickJSONResult {
		const result = {} as SickJSONResult;
		return result;
	}
	stringify(object: SickJSONValue): string {
		return JSON.stringify(this.serialize(object));
	}
}

export { SickJSON, SickJSONResult };



export const stringify = SickJSON.stringify;
export const parse = SickJSON.parse;
