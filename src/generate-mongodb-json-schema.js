/**
 * Generate a MongoDB JSON schema from a Genesys Cloud Platform API definition function.
 * @module generate-mongodb-json-schema
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

// Constants

const constants = {};

constants.gcPlatformAPIDataTypesToBSONTypeMap = {
	object: "object",
	array: "array",
	string: "string",
	number: "double",
	integer: "long",
	boolean: "bool"
};

constants.gcPlatformAPIDataFormatsToBSONTypeMap = {
	"date-time": "date",
	"local-date-time": "date",
	"date": "string",
	"local-time": "string",
	"float": "double",
	"double": "double",
	"int32": "int",
	"int64": "long",
	"uri": "string",
	"url": "string"
};

constants.ignoredGCPlatformAPIDefinitionKeys = [
	"format", // Not actually ignored, just processed as part of the "type" property
	"allowEmptyValue", // Not actually ignored, just processed as part of the "type" property
	"readOnly",
	"position",
	"example",
	"x-genesys-entity-type",
	"x-genesys-search-fields"
];

constants.passthroughGCPlatformAPIDefinitionKeys = ["minimum", "maximum", "minItems", "maxItems", "minLength", "maxLength", "pattern", "required", "uniqueItems", "enum", "description"];

Object.freeze(constants);

// Errors
const errors = require("./generate-mongodb-json-schema-errors.js");

// Regexes
const regexes = {};

regexes.DEFINITION_URI = /^#\/definitions\/(\w+)$/;

Object.freeze(regexes);

/**
 * Generates a MongoDB JSON schema from a Genesys Cloud Platform API definition.
 * @param {object} gcPlatformAPISpec - The Genesys Cloud Platform API specification object.
 * @param {string} gcPlatformAPIDefinitionName - The name of the Genesys Cloud Platform API definition.
 * @returns {object} - The MongoDB JSON schema object.
 * @throws {ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID} If the Genesys Cloud Platform API specification is not an object.
 * @throws {ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING} If the Genesys Cloud Platform API specification does not have a "definitions" property.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID} If the Genesys Cloud Platform API definition name is not a string.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC} If the Genesys Cloud Platform API definition name is not found in the specification.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID} If the Genesys Cloud Platform API definition is not an object.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID} If the Genesys Cloud Platform API definition "format" property value is not valid.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID} If the Genesys Cloud Platform API definition "type" property value is not valid.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID} If the Genesys Cloud Platform API definition "additionalProperties" property value type is not valid.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID} If the Genesys Cloud Platform API definition URI is not valid.
 * @throws {ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID} If a property of the Genesys Cloud Platform API definition is not valid.
 */
function generateMongoDBJSONSchema(gcPlatformAPISpec, gcPlatformAPIDefinitionName) {
	// Check the passed Genesys Cloud platform API specification argument
	if (typeof gcPlatformAPISpec !== "object") {
		throw new errors.ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID();
	}

	// Check if the passed Genesys Cloud platform API specification object has the "definitions" property
	if ("definitions" in gcPlatformAPISpec === false) {
		throw new errors.ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING();
	}

	// Check the passed Genesys Cloud platform API definition name argument
	if (typeof gcPlatformAPIDefinitionName !== "string") {
		throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID();
	}

	// Check if the passed Genesys Cloud platform API definition name exists in the Genesys Cloud platform API specification object
	if (gcPlatformAPIDefinitionName in gcPlatformAPISpec.definitions === false) {
		throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC(gcPlatformAPIDefinitionName);
	}

	// Prepare a definitions stack to avoid circular references
	const gcPlatformAPIDefinitionsStack = [];

	// Return the MongoDB JSON schema
	return {
		$jsonSchema: parseGCPlatformApiDefinition(gcPlatformAPISpec.definitions[gcPlatformAPIDefinitionName])
	};

	/**
	 * Parses a Genesys Cloud Platform API definition object.
	 * @param {object} gcPlatformApiDefinition - The Genesys Cloud Platform API definition object.
	 * @returns {object} - The MongoDB JSON schema object.
	 */
	function parseGCPlatformApiDefinition(gcPlatformApiDefinition) {
		// Check the passed Genesys Cloud platform API definition argument
		if (typeof gcPlatformApiDefinition !== "object") {
			throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID();
		}

		// Check if the Genesys Cloud Platform API defintion is in the definitions stack to avoid circular references
		if (gcPlatformAPIDefinitionsStack.includes(gcPlatformApiDefinition) === true) {
			return {
				bsonType: "object",
				additionalProperties: true
			};
		}

		// Add the Genesys Cloud Platform API definition to the definitions stack
		gcPlatformAPIDefinitionsStack.push(gcPlatformApiDefinition);

		const parsedGCPlatformApiDefinition = {};

		// Iterate over the Genesys Cloud Platform API definition properties
		for (const gcPlatformApiDefinitionKey in gcPlatformApiDefinition) {
			// Ignore Genesys Cloud Platform API definition keys that are not part of the MongoDB JSON schema specification
			if (constants.ignoredGCPlatformAPIDefinitionKeys.includes(gcPlatformApiDefinitionKey) === true) {
				continue;
			}

			// Pass through Genesys Cloud Platform API definition keys that don't require further processing
			if (constants.passthroughGCPlatformAPIDefinitionKeys.includes(gcPlatformApiDefinitionKey) === true) {
				parsedGCPlatformApiDefinition[gcPlatformApiDefinitionKey] = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			// Process the "type" property
			if (gcPlatformApiDefinitionKey === "type") {
				// Process the "format" property if it exists, this overrides the "type" property as the BSON type
				if ("format" in gcPlatformApiDefinition) {
					// Check if the Genesys Cloud definition format is valid
					if (gcPlatformApiDefinition.format in constants.gcPlatformAPIDataFormatsToBSONTypeMap === false) {
						throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID(gcPlatformApiDefinition.format);
					}

					parsedGCPlatformApiDefinition.bsonType = constants.gcPlatformAPIDataFormatsToBSONTypeMap[gcPlatformApiDefinition.format];
				} else {
					// Check if the Genesys Cloud Platform API definition type is valid
					if (gcPlatformApiDefinition.type in constants.gcPlatformAPIDataTypesToBSONTypeMap === false) {
						throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID(gcPlatformApiDefinition.type);
					}

					parsedGCPlatformApiDefinition.bsonType = constants.gcPlatformAPIDataTypesToBSONTypeMap[gcPlatformApiDefinition.type];
				}

				// If the "allowEmptyValue" property exists, convert the "bsonType" property to an array and add "null" to it
				if ("allowEmptyValue" in gcPlatformApiDefinition) {
					parsedGCPlatformApiDefinition.bsonType = [parsedGCPlatformApiDefinition.bsonType, "null"];
				}

				continue;
			}

			// Process the "properties" property
			if (gcPlatformApiDefinitionKey === "properties") {
				parsedGCPlatformApiDefinition.properties = {};
				const definitionProperties = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				for (const definitionPropertyName in definitionProperties) {
					parsedGCPlatformApiDefinition.properties[definitionPropertyName] = parseGCPlatformApiDefinition(definitionProperties[definitionPropertyName]);
				}
				continue;
			}

			// Process the "additionalProperties" property
			if (gcPlatformApiDefinitionKey === "additionalProperties") {
				if (typeof gcPlatformApiDefinition[gcPlatformApiDefinitionKey] === "object") {
					parsedGCPlatformApiDefinition.additionalProperties = parseGCPlatformApiDefinition(gcPlatformApiDefinition[gcPlatformApiDefinitionKey]);
					continue;
				}

				if (typeof gcPlatformApiDefinition[gcPlatformApiDefinitionKey] === "boolean") {
					parsedGCPlatformApiDefinition.additionalProperties = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
					continue;
				}

				throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID();
			}

			// Process the "items" property
			if (gcPlatformApiDefinitionKey === "items") {
				parsedGCPlatformApiDefinition.items = parseGCPlatformApiDefinition(gcPlatformApiDefinition.items);
				continue;
			}

			if (gcPlatformApiDefinitionKey === "$ref") {
				// Check if the Genesys Cloud Platform API definition URI is valid
				if (regexes.DEFINITION_URI.test(gcPlatformApiDefinition["$ref"]) === false) {
					throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID(gcPlatformApiDefinition["$ref"]);
				}

				// Get the Genesys Cloud Platform API definition name from the URI
				const matchedGCPlatformApiDefinitionName = gcPlatformApiDefinition["$ref"].match(regexes.DEFINITION_URI)[1];

				// Check if the matched Genesys Cloud platform API definition exists in the Genesys Cloud platform API specification object
				if (matchedGCPlatformApiDefinitionName in gcPlatformAPISpec.definitions === false) {
					throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC(matchedGCPlatformApiDefinitionName);
				}

				// Parse the matched Genesys Cloud platform API definition
				const parsedMatchedGCPlatformApiDefinition = parseGCPlatformApiDefinition(gcPlatformAPISpec.definitions[matchedGCPlatformApiDefinitionName]);

				// Copy the matched Genesys Cloud platform API definition properties to the parsed Genesys Cloud platform API definition
				Object.assign(parsedGCPlatformApiDefinition, parsedMatchedGCPlatformApiDefinition);

				continue;
			}

			throw new errors.ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID(gcPlatformApiDefinitionKey);
		}

		gcPlatformAPIDefinitionsStack.pop();

		return parsedGCPlatformApiDefinition;
	}
}

module.exports = generateMongoDBJSONSchema;
