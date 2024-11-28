/**
 * @module jfabello/gc-platform-api-utils
 * @description Genesys Cloud platform API utilities for Node.js.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Module imports
const generateMongoDBJSONSchema = require("./generate-mongodb-json-schema.js");
const getGCRegionURLs = require("./get-gc-region-urls.js");
const loadGCPlatformAPISpecFromCloud = require("./load-gc-platform-api-spec-from-cloud.js");

module.exports = {
	generateMongoDBJSONSchema,
	getGCRegionURLs,
	loadGCPlatformAPISpecFromCloud
};
