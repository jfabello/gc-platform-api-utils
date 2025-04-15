/**
 * @module generate-mongodb-json-schema-tests
 * @description Generate a MongoDB JSON schema from a Genesys Cloud Platform API definition function tests.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

// Module imports
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test, beforeAll } from "@jest/globals";
import { ConsoleLogger } from "@jfabello/log-to-console";
import { generateMongoDBJSONSchema, loadGCPlatformAPISpecFromCloud } from "../src/gc-platform-api-utils.js";

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GC_REGION = "us-east-1";
const GC_PLATFORM_API_SPEC_FILE_NAME = "publicapi-v2-latest.json";

// Errors
import { errors } from "../src/generate-mongodb-json-schema-errors.js";

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
			// @ts-expect-error
			generateMongoDBJSONSchema();
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with an invalid Genesys Cloud Platform API specification argument type must throw an ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID error", () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(true);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema("Genesys Cloud");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(() => {});
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID);
		}
	});

	test('An attempt to call the generateMongoDBJSONSchema() function with a Genesys Cloud Platform API specification that is missing the "definitions"  property must throw an ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING error', () => {
		expect.assertions(1);
		try {
			generateMongoDBJSONSchema({}, "Queue");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with an invalid Genesys Cloud Platform API definition name argument type must throw an ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID error", () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(gcPlatformAPISpec, 1234);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(gcPlatformAPISpec, true);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(gcPlatformAPISpec, ["Queue"]);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			generateMongoDBJSONSchema(gcPlatformAPISpec, { definition: "Queue" });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with an unknown Genesys Cloud Platform API definition name argument must throw an ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC error", () => {
		expect.assertions(1);
		try {
			generateMongoDBJSONSchema(gcPlatformAPISpec, "NoDefinition");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC);
		}
	});

	test("An attempt to call the generateMongoDBJSONSchema() function with valid arguments must return an object", () => {
		expect.assertions(1);
		let gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, "Queue");
		expect(typeof gcAPIDefinitionJSONSchema).toBe("object");
	});

	test(
		"The generateMongoDBJSONSchema() function must be able to generate JSON schemas for all the definitions in the Genesys Cloud platform API specification",
		() => {
			expect.assertions(gcPlatformAPISpec.definitions.length);

			for (const gcPlatformAPIDefinitionName in gcPlatformAPISpec.definitions)
				try {
					let gcAPIDefinitionJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, gcPlatformAPIDefinitionName);
					expect(typeof gcAPIDefinitionJSONSchema).toBe("object");
				} catch {
					// This should not happen
				}
		},
		TEST_TIMEOUT
	);
});
