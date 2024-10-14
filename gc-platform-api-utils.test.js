/**
 * @module gc-platform-api-utils-tests
 * @description Genesys Cloud platform API utilities tests.
 * @license GPL-3.0-only
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Module imports
const { describe, expect, test, beforeAll } = require("@jest/globals");
const gcPlatformAPIUtils = require("./gc-platform-api-utils.js");

// Constants
const GC_REGION = "us-east-1";
const TIMEOUT = 60 * 1000; // 60 seconds

// Variables
let gcPlatformAPISpec = null;

beforeAll(async () => {
	gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud(GC_REGION);
}, TIMEOUT);

describe("Genesys Cloud platform API utilities loadGCPlatformAPISpecFromCloud() tests", () => {
	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function without an argument should throw a TypeError error", async () => {
		expect.assertions(1);
		try {
			const gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud();
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
	});

	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function with an invalid argument should throw a TypeError error", async () => {
		expect.assertions(4);
		try {
			const gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud(true);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud([GC_REGION]);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud({ gcRegion: GC_REGION });
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
	});

	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function with an invalid Genesys Cloud region should throw a RangeError error", async () => {
		expect.assertions(1);
		try {
			let gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud("not-a-region");
		} catch (error) {
			expect(error).toBeInstanceOf(RangeError);
		}
	});

	test(
		"An attempt to call the loadGCPlatformAPISpecFromCloud() function with an valid Genesys Cloud region should return an object",
		async () => {
			expect.assertions(1);
			try {
				let gcPlatformAPISpec = await gcPlatformAPIUtils.loadGCPlatformAPISpecFromCloud(GC_REGION);
				expect(typeof gcPlatformAPISpec).toBe("object");
			} catch (error) {
				throw error; // This should not happen
			}
		},
		TIMEOUT
	);
});

describe("Genesys Cloud platform API utilities generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() tests", () => {
	test("An attempt to call the generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function without arguments should throw a TypeError error", () => {
		expect.assertions(1);
		try {
			let gcAPIDefinitionJSONSchema = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition();
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function with an invalid type of Genesys Cloud Platform API specification argument should throw a TypeError error", () => {
		expect.assertions(4);
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(true);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition("Genesys Cloud");
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(() => {});
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function with an invalid type of Genesys Cloud Platform API definition name argument should throw a TypeError error", () => {
		expect.assertions(4);
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition({}, 1234);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition({}, true);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition({}, ["Queue"]);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
		try {
			const gcPlatformAPISpec = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition({}, { definition: "Queue" });
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function with an invalid Genesys Cloud Platform API specification argument should throw a ReferenceError error", () => {
		expect.assertions(1);
		try {
			let gcAPIDefinitionJSONSchema = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition({}, "Queue");
		} catch (error) {
			expect(error).toBeInstanceOf(ReferenceError);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function with an invalid of Genesys Cloud Platform API definition name argument should throw a ReferenceError error", () => {
		expect.assertions(1);
		try {
			let gcAPIDefinitionJSONSchema = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(gcPlatformAPISpec, "NoDefinition");
		} catch (error) {
			expect(error).toBeInstanceOf(ReferenceError);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function with valid arguments should return an object", () => {
		expect.assertions(1);
		try {
			let gcAPIDefinitionJSONSchema = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(gcPlatformAPISpec, "Queue");
			expect(typeof gcAPIDefinitionJSONSchema).toBe("object");
		} catch (error) {
			throw error; // This should not happen
		}
	});

	test("The generateMongoDBJSONSchemaFromGCPlatformAPIDefinition() function should be able to generate JSON schemas for all the definitions in the Genesys Cloud platform API specification", () => {
			expect.assertions(gcPlatformAPISpec.definitions.length);

			for (const gcPlatformAPIDefinitionName in gcPlatformAPISpec.definitions)
				try {
					let gcAPIDefinitionJSONSchema = gcPlatformAPIUtils.generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(gcPlatformAPISpec, gcPlatformAPIDefinitionName);
					expect(typeof gcAPIDefinitionJSONSchema).toBe("object");
				} catch (error) {
					// This should not happen
				}
		},
		TIMEOUT
	);
});
