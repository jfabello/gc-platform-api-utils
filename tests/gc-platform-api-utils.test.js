/**
 * @module gc-platform-api-utils-test
 * @description Genesys Cloud platform API utilities for Node.js tests.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

// Module imports
const { describe, expect, test } = require("@jest/globals");
const { GC_PLATFORM_API_UTILS_ERRORS } = require("../src/gc-platform-api-utils.js");

describe("Get the Genesys Cloud region URLs function tests", () => {
	test("Check that GC_PLATFORM_API_UTILS_ERRORS is an object", () => {
		expect.assertions(1);
		expect(typeof GC_PLATFORM_API_UTILS_ERRORS).toBe("object");
	});

	test("Check that the properties of GC_PLATFORM_API_UTILS_ERRORS are functions", () => {
		expect.assertions(Object.keys(GC_PLATFORM_API_UTILS_ERRORS).length);
		for (const property in GC_PLATFORM_API_UTILS_ERRORS) {
			expect(typeof GC_PLATFORM_API_UTILS_ERRORS[property]).toBe("function");
		}
	});
});
