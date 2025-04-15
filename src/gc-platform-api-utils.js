/**
 * Genesys Cloud platform API utilities for Node.js.
 * @module jfabello/gc-platform-api-utils
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Module imports
import { generateMongoDBJSONSchema } from "./generate-mongodb-json-schema.js";
import { getGCRegionURLs, gcRegions } from "./get-gc-region-urls.js";
import { loadGCPlatformAPISpecFromCloud } from "./load-gc-platform-api-spec-from-cloud.js";

// Errors

import {errors as commonErrors} from "./common-errors.js";
import {errors as generateMongoDBJSONSchemaErrors} from "./generate-mongodb-json-schema-errors.js";
const errors = Object.assign({}, commonErrors, generateMongoDBJSONSchemaErrors);
Object.freeze(errors);


export {
	generateMongoDBJSONSchema,
	getGCRegionURLs,
	loadGCPlatformAPISpecFromCloud,
	errors,
	gcRegions
};
