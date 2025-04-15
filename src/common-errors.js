/**
 * Genesys Cloud platform API utilities for Node.js common errors.
 * @module gc-platform-api-utils-errors
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

/**
 * Thrown when the Genesys Cloud region is not valid
 * @class ERROR_GC_REGION_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_REGION_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud region type is not valid, it must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud region is not valid
 * @class ERROR_GC_REGION_INVALID
 * @extends TypeError
 */
class ERROR_GC_REGION_INVALID extends TypeError {
	/**
	 * @constructor
	 * @param {string} gcRegion - The invalid Genesys Cloud region.
	 */
	constructor(gcRegion) {
		super(`The Genesys Cloud region ${gcRegion} is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the timeout type is not valid
 * @class ERROR_TIMEOUT_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_TIMEOUT_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The timeout type is not valid, it must be a positive integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the timeout value is out of bounds
 * @class ERROR_TIMEOUT_OUT_OF_BOUNDS
 * @extends RangeError
 */
class ERROR_TIMEOUT_OUT_OF_BOUNDS extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The timeout type is not valid, it must be a positive integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when an error occurs on the Genesys Cloud services side
 * @class ERROR_GENESYS_CLOUD_SERVICES_ERROR
 * @extends Error
 */
class ERROR_GENESYS_CLOUD_SERVICES_ERROR extends Error {
	/**
	 * @constructor
	 * @param {string} [extendedMessage] - The extended error message.
	 */
	constructor(extendedMessage) {
		super("An error ocurrred on the Genesys Cloud services side.");
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof extendedMessage === "string") this.extendedMessage = extendedMessage;
	}
}

/**
 * Thrown when an error occurs on the HTTP client side
 * @class ERROR_HTTP_CLIENT_ERROR
 * @extends Error
 */
class ERROR_HTTP_CLIENT_ERROR extends Error {
	/**
	 * @constructor
	 * @param {string} [extendedMessage] - The extended error message.
	 * @param {Error} [extendedError] - The extended error object.
	 */
	constructor(extendedMessage, extendedError) {
		super("An error ocurrred on the HTTP client side.");
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof extendedMessage === "string") this.extendedMessage = extendedMessage;
		if (typeof extendedError === "object" && extendedError instanceof Error) this.extendedError = extendedError;
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

export { errors };
