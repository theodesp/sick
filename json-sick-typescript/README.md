<h1 align="center">SICK: Streams of Independent Constant Keys in TypeScript</h1>

<p align="center">
	<a href="https://github.com/theodesp/json-sick-typescript/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank">
		<img alt="Contributor Covenant" src="https://img.shields.io/badge/code_of_conduct-enforced-21bb42" />
	</a>
	<a href="https://github.com/theodesp/json-sick-typescript/blob/main/LICENSE.md" target="_blank">
		<img alt="License: MIT" src="https://img.shields.io/github/license/theodesp/json-sick-typescript?color=21bb42">
	</a>
	<img alt="Style: Prettier" src="https://img.shields.io/badge/style-prettier-21bb42.svg" />
	<img alt="TypeScript: Strict" src="https://img.shields.io/badge/typescript-strict-21bb42.svg" />
	<img alt="npm package version" src="https://img.shields.io/npm/v/json-sick-typescript?color=21bb42" />
</p>

## Basic Usage

First you create an instance of the Sick JSON serializer and use it similar to `JSON.stringify` and `JSON.parse` methods.

To serialize any expression you type:

```
import { createSick, sickDate } from "json-sick-typescript";
const obj = {
	array: [{ foo: 1 }, { bar: 2 }, { baz: 3 }],
	date: new Date(),
	number: 42,
};

const sick = createSick({
	nonce: () => "__",
	handles: [sickDate],
});
```

To read the serialized expression back you type:

## API

`parse`

`stringify`

`encode`

`decode`

## LICENCE

MIT
