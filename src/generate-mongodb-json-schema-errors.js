/**
 * Generate a MongoDB JSON schema from a Genesys Cloud Platform API definition errors.
 * @module generate-mongodb-json-schema-errors
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

/**
 * Thrown when the Genesys Cloud platform API specification type not valid
 * @class ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("Invalid Genesys Cloud platform API specification type, it must be an object.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition type is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("Invalid Genesys Cloud platform API definition type, it must be an object.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition name type is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("Invalid Genesys Cloud platform API definition name type, it must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API specification object is missing the "definitions" property
 * @class ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING
 * @extends ReferenceError
 */
class ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING extends ReferenceError {
	/**
	 * @constructor
	 */
	constructor() {
		super('The Genesys Cloud platform API specification object is missing the "definitions" property.');
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition is not found in the specification object
 * @class ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC
 * @extends ReferenceError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC extends ReferenceError {
	/**
	 * @constructor
	 * @param {string} gcPlatformAPIDefinition - The Genesys Cloud Platform API definition name
	 */
	constructor(gcPlatformAPIDefinition) {
		super(`The definition "${gcPlatformAPIDefinition}" was not found in the Genesys Cloud Platform API specification object.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition URI is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID
 * @extends ReferenceError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID extends ReferenceError {
	/**
	 * @constructor
	 * @param {string} gcPlatformAPIDefinitionURI - The Genesys Cloud Platform API definition URI
	 */
	constructor(gcPlatformAPIDefinitionURI) {
		super(`The URI "${gcPlatformAPIDefinitionURI}" is not a valid Genesys Cloud platform API definition URI.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition "format" property value is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID
 * @extends RangeError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID extends RangeError {
	/**
	 * @constructor
	 * @param {string} gcPlatformAPIDefinitionFormatPropertyValue - The Genesys Cloud platform API definition "format" property value
	 */
	constructor(gcPlatformAPIDefinitionFormatPropertyValue) {
		super(`The Genesys Cloud platform API definition "format" property value "${gcPlatformAPIDefinitionFormatPropertyValue}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition "type" property value is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID
 * @extends RangeError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID extends RangeError {
	/**
	 * @constructor
	 * @param {string} gcPlatformAPIDefinitionTypePropertyValue - The Genesys Cloud platform API definition "type" property value
	 */
	constructor(gcPlatformAPIDefinitionTypePropertyValue) {
		super(`The Genesys Cloud platform API definition "type" property value "${gcPlatformAPIDefinitionTypePropertyValue}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud platform API definition property is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID
 * @extends RangeError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID extends RangeError {
	/**
	 * @constructor
	 * @param {string} gcPlatformAPIDefinitionProperty - The property name
	 */
	constructor(gcPlatformAPIDefinitionProperty) {
		super(`The Genesys Cloud platform API definition property "${gcPlatformAPIDefinitionProperty}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud Platform API definition "additionalProperties" property value type is not valid
 * @class ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super(`The Genesys Cloud Platform API defintion "additionalProperties" property value type is not valid, it must be an object or a boolean.`);
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

export { errors };
