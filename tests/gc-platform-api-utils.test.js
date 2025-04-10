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
const { errors } = require("../src/gc-platform-api-utils.js");

describe("Get the Genesys Cloud region URLs function tests", () => {
	test("Check that the Genesys Cloud Platform API utilities errors object is an object", () => {
		expect.assertions(1);
		expect(typeof errors).toBe("object");
	});

	test("Check that the properties of the Genesys Cloud Platform API utilities errors object are functions", () => {
		expect.assertions(Object.keys(errors).length);
		for (const property in errors) {
			expect(typeof errors[property]).toBe("function");
		}
	});
});
