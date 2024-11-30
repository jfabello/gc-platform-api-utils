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
const { gcPlatformAPIUtilsErrors } = require("../src/gc-platform-api-utils.js");

describe("Get the Genesys Cloud region URLs function tests", () => {
	test("Check that gcPlatformAPIUtilsErrors is an object", () => {
		expect.assertions(1);
		expect(typeof gcPlatformAPIUtilsErrors).toBe("object");
	});

	test("Check that the properties of gcPlatformAPIUtilsErrors are functions", () => {
		expect.assertions(Object.keys(gcPlatformAPIUtilsErrors).length);
		for (const property in gcPlatformAPIUtilsErrors) {
			expect(typeof gcPlatformAPIUtilsErrors[property]).toBe("function");
		}
	});
});
