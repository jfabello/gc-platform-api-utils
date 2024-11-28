/**
 * @module gc-platform-api-utils-errors
 * @description Genesys Cloud platform API utilities for Node.js common errors.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

class ERROR_GC_REGION_TYPE_INVALID extends TypeError {
	constructor() {
		super("The Genesys Cloud region type is not valid, it should be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_REGION_INVALID extends TypeError {
	constructor(gcRegion) {
		super(`The Genesys Cloud region ${gcRegion} is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_TIMEOUT_TYPE_INVALID extends TypeError {
	constructor() {
		super("The timeout type is not valid, it should be a positive integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_TIMEOUT_OUT_OF_BOUNDS extends RangeError {
	constructor() {
		super("The timeout type is not valid, it should be a positive integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GENESYS_CLOUD_SERVICES_ERROR extends Error {
	constructor() {
		super("An error ocurrred on the Genesys Cloud services side.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_HTTP_CLIENT_ERROR extends Error {
	constructor() {
		super("An error ocurrred on the HTTP client side.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

const errors = {
	ERROR_GC_REGION_TYPE_INVALID,
	ERROR_GC_REGION_INVALID,
	ERROR_TIMEOUT_TYPE_INVALID,
	ERROR_TIMEOUT_OUT_OF_BOUNDS,
	ERROR_GENESYS_CLOUD_SERVICES_ERROR,
	ERROR_HTTP_CLIENT_ERROR
};

Object.freeze(errors);

module.exports = errors;
