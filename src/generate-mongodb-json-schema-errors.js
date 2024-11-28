/**
 * @module generate-mongodb-json-schema-errors
 * @description Generate a MongoDB JSON schema from a Genesys Cloud Platform API definition errors.
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

class ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID extends TypeError {
	constructor() {
		super("Invalid Genesys Cloud platform API specification type, it must be an object.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID extends TypeError {
	constructor() {
		super("Invalid Genesys Cloud platform API definition type, it must be an object.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID extends TypeError {
	constructor() {
		super("Invalid Genesys Cloud platform API definition name type, it must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING extends ReferenceError {
	constructor() {
		super('The Genesys Cloud platform API specification object is missing the "definitions" property.');
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC extends ReferenceError {
	constructor(definition) {
		super(`The definition "${definition}" was not found in the Genesys Cloud Platform API specification object.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID extends ReferenceError {
	constructor(definitionURI) {
		super(`The URI "${definitionURI}" is not a valid Genesys Cloud platform API definition URI.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID extends RangeError {
	constructor(formatValue) {
		super(`The Genesys Cloud platform API definition "format" property value "${formatValue}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID extends RangeError {
	constructor(typeValue) {
		super(`The Genesys Cloud platform API definition "type" property value "${typeValue}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID extends RangeError {
	constructor(property) {
		super(`The Genesys Cloud platform API definition property "${property}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

class ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID extends TypeError {
	constructor() {
		super(`The Genesys Cloud Platform API defintion "additionalProperties" property value type is not valid, it should be an object or a boolean.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

const errors = {
	ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID,
	ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID,
	ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID,
	ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING,
	ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC,
	ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID,
	ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID,
	ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID,
	ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID,
	ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID
};

Object.freeze(errors);

module.exports = errors;
