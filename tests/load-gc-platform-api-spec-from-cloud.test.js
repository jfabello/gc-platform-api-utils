/**
 * @module load-gc-platform-api-spec-from-cloud
 * @description Load the Genesys Cloud Platform API specification from the cloud function tests.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Module imports
import { describe, expect, test } from "@jest/globals";
import { loadGCPlatformAPISpecFromCloud } from "../src/gc-platform-api-utils.js";

// Constants
const GC_REGION = "us-east-1";
const TEST_TIMEOUT = 60 * 1000; // 60 seconds

// Errors
import { errors } from "../src/common-errors.js";

describe("Load the Genesys Cloud Platform API specification from the cloud function tests", () => {
	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function without an argument must throw an ERROR_GC_REGION_TYPE_INVALID error", async () => {
		expect.assertions(1);
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud();
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
	});

	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function with an invalid Genesys Cloud region argument type must throw an ERROR_GC_REGION_TYPE_INVALID error", async () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud(true);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud([GC_REGION]);
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud({ gcRegion: GC_REGION });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_TYPE_INVALID);
		}
	});

	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function with an invalid timeout option argument type must throw an ERROR_TIMEOUT_TYPE_INVALID error", async () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: "60000" });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_TIMEOUT_TYPE_INVALID);
		}
		try {
			await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: 60000.5 });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_TIMEOUT_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: [60 * 1000] });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_TIMEOUT_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: { timeout: 60000 } });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_TIMEOUT_TYPE_INVALID);
		}
	});

	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function with an invalid timeout option argument must throw an ERROR_TIMEOUT_OUT_OF_BOUNDS error", async () => {
		expect.assertions(2);
		try {
			await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: -60 * 1000 });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_TIMEOUT_OUT_OF_BOUNDS);
		}

		try {
			await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: 0 });
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_TIMEOUT_OUT_OF_BOUNDS);
		}
	});

	test("An attempt to call the loadGCPlatformAPISpecFromCloud() function with an invalid Genesys Cloud region argument must throw an ERROR_GC_REGION_INVALID error", async () => {
		expect.assertions(1);
		try {
			await loadGCPlatformAPISpecFromCloud("not-a-region");
		} catch (error) {
			expect(error).toBeInstanceOf(errors.ERROR_GC_REGION_INVALID);
		}
	});

	test(
		"An attempt to call the loadGCPlatformAPISpecFromCloud() function with a valid Genesys Cloud region argument must return an object",
		async () => {
			expect.assertions(1);

			let gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(GC_REGION);
			expect(typeof gcPlatformAPISpec).toBe("object");
		},
		TEST_TIMEOUT
	);

	test(
		"An attempt to call the loadGCPlatformAPISpecFromCloud() function with valid Genesys Cloud region and timeout option arguments must return an object",
		async () => {
			expect.assertions(1);

			let gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(GC_REGION, { timeout: 120 * 1000 });
			expect(typeof gcPlatformAPISpec).toBe("object");
		},
		TEST_TIMEOUT
	);
});
