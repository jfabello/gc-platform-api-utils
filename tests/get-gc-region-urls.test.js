/**
 * @module generate-mongodb-json-schema-from-gc-api-def-tests
 * @description Get the Genesys Cloud region URLs function tests.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

// Module imports
const { describe, expect, test } = require("@jest/globals");
const { getGCRegionURLs } = require("../src/gc-platform-api-utils.js");

// Constants
const GC_REGION = "us-east-1";

// Errors
const errors = require("../src/common-errors.js");

describe("Get the Genesys Cloud region URLs function tests", () => {
	test("An attempt to call the getGCRegionURLs() function without arguments should throw an ERROR_GC_REGION_TYPE_INVALID error", () => {
		expect.assertions(1);
		try {
			const gcRegionURLs = getGCRegionURLs();
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
	});

	test("An attempt to call the getGCRegionURLs() function with an invalid Genesys Cloud region argument type sould throw an ERROR_GC_REGION_TYPE_INVALID error", () => {
		expect.assertions(4);
		try {
			const gcRegionURLs = getGCRegionURLs(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
		try {
			const gcRegionURLs = getGCRegionURLs(true);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
		try {
			const gcRegionURLs = getGCRegionURLs(["us-east-1"]);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
		try {
			const gcRegionURLs = getGCRegionURLs({ region: "us-east-1" });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
	});

	test("An attempt to call the getGCRegionURLs() function with an invalid Genesys Cloud region should throw an ERROR_GC_REGION_INVALID error", () => {
		expect.assertions(1);
		try {
			const gcRegionURLs = getGCRegionURLs("not-a-region");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_INVALID);
		}
	});

	test("An attempt to call the getGCRegionURLs() function with a valid Genesys Cloud region should return the Genesys Cloud region URLs", () => {
		expect.assertions(7);
		const gcRegionURLs = getGCRegionURLs(GC_REGION);
		expect(typeof gcRegionURLs).toBe("object");
		expect("api" in gcRegionURLs).toBe(true);
		expect(gcRegionURLs.api).toBeInstanceOf(URL);
		expect("apps" in gcRegionURLs).toBe(true);
		expect(gcRegionURLs.apps).toBeInstanceOf(URL);
		expect("login" in gcRegionURLs).toBe(true);
		expect(gcRegionURLs.login).toBeInstanceOf(URL);
	});
});