/**
 * Load the Genesys Cloud Platform API specification from the cloud function.
 * @module load-gc-platform-api-spec-from-cloud
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Module imports
import { HTTPClient } from "@jfabello/http-client";
import { getGCRegionURLs } from "./get-gc-region-urls.js";

// Defaults
import { defaults } from "./common-defaults.js";

// Errors
import { errors } from "./common-errors.js";

/**
 * @description Loads the Genesys Cloud Platform API specification from the Genesys Cloud servers.
 * @param {string} gcRegion - The Genesys Cloud region to load the API specification from.
 * @param {object} [options] - Optional parameters.
 * @param {number} [options.timeout=defaults.DEFAULT_HTTP_TIMEOUT] - The HTTP request timeout in milliseconds. The default is 60 seconds.
 * @returns {Promise<object>} A promise that resolves to an object with the Genesys Cloud Platform API specification, or rejects to an error if the operation fails.
 * @throws {ERROR_GC_REGION_TYPE_INVALID} If the gcRegion argument is not a string.
 * @throws {ERROR_TIMEOUT_TYPE_INVALID} If the timeout argument is not a number or not an integer.
 * @throws {ERROR_TIMEOUT_OUT_OF_BOUNDS} If the timeout argument is less than 1 milliseconds.
 * @throws {ERROR_HTTP_CLIENT_ERROR} If there is an error with the HTTP client.
 * @throws {ERROR_GENESYS_CLOUD_SERVICES_ERROR} If there is an error with the Genesys Cloud services.
 */
async function loadGCPlatformAPISpecFromCloud(gcRegion, { timeout = defaults.DEFAULT_HTTP_TIMEOUT } = {}) {
	// Check the passed Genesys Cloud region argument
	if (typeof gcRegion !== "string") {
		throw new errors.ERROR_GC_REGION_TYPE_INVALID();
	}

	// Check the passed timeout argument
	if (typeof timeout !== "number" || Number.isInteger(timeout) === false) {
		throw new errors.ERROR_TIMEOUT_TYPE_INVALID();
	}

	if (timeout < 1) {
		throw new errors.ERROR_TIMEOUT_OUT_OF_BOUNDS();
	}

	// Get the Genesys Cloud region API URL
	const gcRegionURLs = getGCRegionURLs(gcRegion);
	const gcRegionAPIURL = gcRegionURLs.api;

	let gcPlatformAPISpecURL = new URL("/api/v2/docs/swagger", gcRegionAPIURL);

	// Retrieve the Genesys Cloud Platform API specification (swagger file)
	for (let retry = 0; retry < 10; retry++) {
		let httpRequest = null;
		let httpResponse = null;

		// Create a new HTTP Client instance and makes the HTTP request
		try {
			httpRequest = new HTTPClient(gcPlatformAPISpecURL, { timeout: timeout, autoJSONResponseParse: true });
			httpResponse = await httpRequest.makeRequest();
		} catch (error) {
			/* istanbul ignore next: It is not possible to generate an HTTP client error under normal operation */
			throw new errors.ERROR_HTTP_CLIENT_ERROR(error.message, error);
		}

		// Retry the HTTP request if the response status code is 301 (Moved Permanently)
		if (httpResponse.statusCode === 301) {
			if ("location" in httpResponse.headers === false) {
				/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
				throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR("No location specified in the HTTP response headers.");
			}

			gcPlatformAPISpecURL = new URL(httpResponse.headers.location);
			continue;
		}

		// Return the Genesys Cloud Platform API specification if the HTTP response status code is 200
		if (httpResponse.statusCode === 200) {
			if ("content-type" in httpResponse.headers === false) {
				/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
				throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR("No content type specified in the HTTP response headers.");
			}

			if (httpResponse.headers["content-type"].trim().toLowerCase().includes("application/json") === false) {
				/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
				throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR('Invalid HTTP response content type, expected "application/json".');
			}

			if ("body" in httpResponse === false) {
				/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
				throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR("The HTTP response does not have a body.");
			}

			// Verify that the HTTP response body has all the base properties of a Swagger file
			if ("paths" in httpResponse.body === false) {
				/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
				throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR('The Genesys Cloud Platform API specification is missing the "paths" property.');
			}

			if ("definitions" in httpResponse.body === false) {
				/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
				throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR('The Genesys Cloud Platform API specification is missing the "definitions" property.');
			}

			return httpResponse.body;
		}

		// Throw an error if the HTTP response status code is not expected
		/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
		throw new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR(`Unexpected HTTP response status code ${httpResponse.statusCode} (${httpResponse.statusMessage}).`);
	}

	// Throw an error if the HTTP request was redirected too many times
	/* istanbul ignore next: It is not possible to generate an Genesys Cloud error under normal operation */
	{
		const error = new errors.ERROR_GENESYS_CLOUD_SERVICES_ERROR();
		error.extendedMessage = "Too many HTTP response redirections.";
		throw error;
	}
}

export { loadGCPlatformAPISpecFromCloud };
