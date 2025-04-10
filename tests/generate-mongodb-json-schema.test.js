/**
 * @module generate-mongodb-json-schema-tests
 * @description Generate a MongoDB JSON schema from a Genesys Cloud Platform API definition function tests.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

// Module imports
const fs = require("node:fs");
const path = require("node:path");
const { describe, expect, test, beforeAll } = require("@jest/globals");
const ConsoleLogger = require("@jfabello/log-to-console");
const { generateMongoDBJSONSchema, loadGCPlatformAPISpecFromCloud } = require("../src/gc-platform-api-utils.js");

// Constants
const GC_REGION = "us-east-1";
const GC_PLATFORM_API_SPEC_FILE_NAME = "publicapi-v2-latest.json";

// Errors
const errors = require("../src/generate-mongodb-json-schema-errors.js");

const TEST_TIMEOUT = 60 * 1000; // 60 seconds

// Variables
let gcPlatformAPISpec = null;

// Create a new console logger instance
const logToConsole = new ConsoleLogger(ConsoleLogger.INFO);

beforeAll(async () => {
	console.log(path.join(__dirname, "tests", GC_PLATFORM_API_SPEC_FILE_NAME));
	if (fs.existsSync(path.join(__dirname, GC_PLATFORM_API_SPEC_FILE_NAME)) === true && fs.statSync(path.join(__dirname, GC_PLATFORM_API_SPEC_FILE_NAME)).isFile() === true) {
		// Loads the Genesys Cloud Platform API specification from a local file
		logToConsole.info("Loading the Genesys Cloud Platform API specification from a local file...");
		gcPlatformAPISpec = JSON.parse(fs.readFileSync(path.join(__dirname, GC_PLATFORM_API_SPEC_FILE_NAME), "utf8"));
	} else {
		// Loads the Genesys Cloud Platform API specification from the cloud
		logToConsole.info("Loading the Genesys Cloud Platform API specification from the cloud...");
		gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(GC_REGION);
	}
	logToConsole.info("Successfully loaded the Genesys Cloud Platform API specification.");
}, TEST_TIMEOUT);

describe("Generate a MongoDB JSON schema from a Genesys Cloud Platform API definition function tests", () => {
	test("An attempt to call the generateMongoDBJSONSchema() function without arguments must throw an ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID error", () => {
		expect.assertions(1);
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema();
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with an invalid Genesys Cloud Platform API specification argument type must throw an ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID error", () => {
		expect.assertions(4);
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(true);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema("Genesys Cloud");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(() => {});
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
	});

	test('An attempt to call the generateMongoDBJSONSchema() function with a Genesys Cloud Platform API specification that is missing the "definitions"  property must throw an ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING error', () => {
		expect.assertions(1);
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema({}, "Queue");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with an invalid Genesys Cloud Platform API definition name argument type must throw an ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID error", () => {
		expect.assertions(4);
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, 1234);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, true);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, ["Queue"]);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, { definition: "Queue" });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with an unknown Genesys Cloud Platform API definition name argument must throw an ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC error", () => {
		expect.assertions(1);
		try {
			const gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, "NoDefinition");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with valid arguments must return an object", () => {
		expect.assertions(1);
		try {
			let gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, "Queue");
			expect(typeof gcAPIDefinitionJSONSchema).toBe("object");
		} catch (error) {
			throw error; // This should not happen
		}
	});

	test(
		"The generateMongoDBJSONSchema() function must be able to generate JSON schemas for all the definitions in the Genesys Cloud platform API specification",
		() => {
			expect.assertions(gcPlatformAPISpec.definitions.length);

			for (const gcPlatformAPIDefinitionName in gcPlatformAPISpec.definitions)
				try {
					let gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, gcPlatformAPIDefinitionName);
					expect(typeof gcAPIDefinitionJSONSchema).toBe("object");
				} catch (error) {
					// This should not happen
				}
		},
		TEST_TIMEOUT
	);
});
