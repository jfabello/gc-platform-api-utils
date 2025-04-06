/**
 *  Get the Genesys Cloud region URLs function.
 * @module get-gc-region-urls
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Constants

// From https://developer.genesys.cloud/platform/api/

const GC_REGIONS = ["us-east-1", "us-east-2", "us-west-2", "ca-central-1", "eu-west-1", "eu-west-2", "eu-central-1", "eu-central-2", "ap-south-1", "ap-northeast-1", "ap-northeast-2", "ap-northeast-3", "ap-southeast-2", "sa-east-1", "me-central-1"];

const GC_REGIONS_DOMAIN_NAMES = {
	"us-east-1": "mypurecloud.com", // US East (Virginia)
	"us-east-2": "use2.us-gov-pure.cloud", // US East 2 (Ohio)
	"us-west-2": "usw2.pure.cloud", // US West (Oregon)
	"ca-central-1": "cac1.pure.cloud", // Canada (Central)
	"eu-west-1": "mypurecloud.ie", // Europe (Ireland)
	"eu-west-2": "euw2.pure.cloud", // Europe (London)
	"eu-central-1": "mypurecloud.de", // Europe (Frankfurt)
	"eu-central-2": "euc2.pure.cloud", // Europe (Zurich)
	"ap-south-1": "aps1.pure.cloud", // Asia Pacific (Mumbai)
	"ap-northeast-1": "mypurecloud.jp", // Asia Pacific (Tokyo)
	"ap-northeast-2": "apne2.pure.cloud", // Asia Pacific (Seoul)
	"ap-northeast-3": "apne3.pure.cloud", // Asia Pacific (Osaka)
	"ap-southeast-2": "mypurecloud.com.au", // Asia Pacific (Sydney)
	"sa-east-1": "sae1.pure.cloud", // South America (São Paulo)
	"me-central-1": "mec1.pure.cloud" // Middle East (UAE)
};

Object.freeze(GC_REGIONS);
Object.freeze(GC_REGIONS_DOMAIN_NAMES);

// Errors
const errors = require("./common-errors.js");

/**
 * @typedef {object} GCRegionURLs
 * @property {URL} api The API server URL
 * @property {URL} apps The Apps URL
 * @property {URL} login The Auth server URL
 */

/**
 * @description Gets the Genesys Cloud URLs (API, apps, and login) for the specified Genesys Cloud region.
 * @param {string} gcRegion The Genesys Cloud region.
 * @returns {GCRegionURLs} The Genesys Cloud region URLs.
 * @throws {ERROR_GC_REGION_TYPE_INVALID} If the Genesys Cloud region is not a string.
 * @throws {ERROR_GC_REGION_INVALID} If the Genesys Cloud region is not a valid region.
 */
function getGCRegionURLs(gcRegion) {
	// Check the passed Genesys Cloud region argument
	if (typeof gcRegion !== "string") {
		throw new errors.ERROR_GC_REGION_TYPE_INVALID();
	}

	gcRegion = gcRegion.trim().toLowerCase();

	if (gcRegion in GC_REGIONS_DOMAIN_NAMES === false) {
		throw new errors.ERROR_GC_REGION_INVALID();
	}

	const gcDomain = GC_REGIONS_DOMAIN_NAMES[gcRegion];

	// Return an object with the Genesys Cloud region URLs
	return {
		api: new URL(`https://api.${gcDomain}/`),
		apps: new URL(`https://apps.${gcDomain}/`),
		login: new URL(`https://login.${gcDomain}/`)
	};
}

module.exports = getGCRegionURLs;
