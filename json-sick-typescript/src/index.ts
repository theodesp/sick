export * from "./errors.js";

// --- sync --

import type { SickJSONResult, SickJSONValue } from "./types.js";

export default class SickJSON {
	private static defaultInstance = new SickJSON();

	serialize(object: SickJSONValue): SickJSONResult {
		const result = {} as SickJSONResult;
		return result;
	}
	deserialize<T = unknown>(payload: SickJSONResult): T {
		const result = {} as any;
		return result;
	}

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
	parse<T = unknown>(string: string): T {
		return this.deserialize(JSON.parse(string));
	}
	stringify(object: SickJSONValue): string {
		return JSON.stringify(this.serialize(object));
	}
}

export { SickJSON, SickJSONResult };



export const stringify = SickJSON.stringify;
export const parse = SickJSON.parse;
