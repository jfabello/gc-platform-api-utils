/**
 * Genesys Cloud platform API utilities for Node.js.
 * @module jfabello/gc-platform-api-utils
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Module imports
const generateMongoDBJSONSchema = require("./generate-mongodb-json-schema.js");
const getGCRegionURLs = require("./get-gc-region-urls.js");
const loadGCPlatformAPISpecFromCloud = require("./load-gc-platform-api-spec-from-cloud.js");

// Errors

const commonErrors = require("./common-errors.js");
const generateMongoDBJSONSchemaErrors = require("./generate-mongodb-json-schema-errors.js");
const gcPlatformAPIUtilsErrors = Object.assign({}, commonErrors, generateMongoDBJSONSchemaErrors);
Object.freeze(gcPlatformAPIUtilsErrors);


module.exports = {
	generateMongoDBJSONSchema,
	getGCRegionURLs,
	loadGCPlatformAPISpecFromCloud,
	gcPlatformAPIUtilsErrors
};
