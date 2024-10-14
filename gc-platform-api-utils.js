/**
 * @module jfabello/gc-platform-api-utils
 * @description Genesys Cloud platform API utilities.
 * @license GPL-3.0-only
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Module imports
const fs = require("node:fs");
const path = require("node:path");
const { HTTPClient } = require("@jfabello/http-client");

// Constants

const constants = {};
constants.gcPlatformAPIDataTypes = ["object", "array", "string", "number", "integer", "boolean"];
constants.gcPlatformAPIDataFormats = ["date-time", "local-date-time", "date", "local-time", "float", "double", "int32", "int64", "uri", "url"];
Object.freeze(constants);

// Regexes
const regexes = {};
regexes.DEFINITION_URI = /^#\/definitions\/(\w+)$/;
Object.freeze(regexes);

async function loadGCPlatformAPISpecFromCloud(gcRegion) {
	const gcRegionAPIURL = getGCRegionURLs(gcRegion).api;
	let gcPlatformAPISpecURL = new URL("/api/v2/docs/swagger", gcRegionAPIURL);

	for (let retry = 0; retry < 10; retry++) {
		const httpRequest = new HTTPClient(gcPlatformAPISpecURL);
		const httpResponse = await httpRequest.makeRequest();

		if (httpResponse.statusCode === 301) {
			if ("location" in httpResponse.headers === false) {
				throw Error("No new location specified in the HTTP response headers.");
			}

			gcPlatformAPISpecURL = new URL(httpResponse.headers.location);

			continue;
		}

		if (httpResponse.statusCode === 200) {
			if (typeof httpResponse.body !== "object" || httpResponse.body instanceof Buffer === false) {
				throw new Error("Invalid HTTP response body.");
			}

			if ("content-type" in httpResponse.headers === false) {
				throw new Error("No content type specified in the HTTP response headers.");
			}

			if (httpResponse.headers["content-type"] !== "application/json") {
				throw new Error('Invalid HTTP response content type, expected "application/json".');
			}

			let gcPlatformAPISpec = null;

			try {
				gcPlatformAPISpec = JSON.parse(httpResponse.body.toString("utf8"));
			} catch (error) {
				throw new Error("Could not parse HTTP response body as JSON.");
			}

			return gcPlatformAPISpec;
		}

		throw new Error(`Unexpected HTTP response status code ${httpResponse.statusCode} with message "${httpResponse.statusMessage}".`);
	}

	throw new Error("Too many HTTP response redirections.");
}

function generateMongoDBJSONSchemaFromGCPlatformAPIDefinition(gcPlatformAPISpec, gcPlatformAPIDefinitionName) {
	if (typeof gcPlatformAPISpec !== "object") {
		throw new TypeError("Invalid Genesys Cloud platform API specification argument type, it must be an object.");
	}

	if (typeof gcPlatformAPIDefinitionName !== "string") {
		throw new TypeError("Invalid Genesys Cloud platform API definition argument type, it must be a string.");
	}

	if ("definitions" in gcPlatformAPISpec === false) {
		throw new ReferenceError('The Genesys Cloud platform API specification object is missing the "definitions" property.');
	}

	if (gcPlatformAPIDefinitionName in gcPlatformAPISpec.definitions === false) {
		throw new ReferenceError(`The definition "${gcPlatformAPIDefinitionName}" was not found in the Genesys Cloud Platform API specification object.`);
	}

	// Prepares a definitions stack to avoid circular references
	const gcPlatformAPIDefinitionsStack = [];

	return {
		$jsonSchema: parseGCPlatformApiDefinition(gcPlatformAPISpec.definitions[gcPlatformAPIDefinitionName])
	};

	function parseGCPlatformApiDefinition(gcPlatformApiDefinition) {
		if (typeof gcPlatformApiDefinition !== "object") {
			throw TypeError("Invalid Genesys Cloud platform API definition argument type, it must be an object.");
		}

		// Avoids circular references
		if (gcPlatformAPIDefinitionsStack.includes(gcPlatformApiDefinition) === true) {
			return {
				bsonType: "object",
				additionalProperties: true
			};
		}

		gcPlatformAPIDefinitionsStack.push(gcPlatformApiDefinition);

		if ("$ref" in gcPlatformApiDefinition) {
			if (regexes.DEFINITION_URI.test(gcPlatformApiDefinition["$ref"]) === false) {
				throw ReferenceError(`"${gcPlatformApiDefinition["$ref"]}" is not a valid Genesys Cloud platform API definition URI.`);
			}

			const matchedGCPlatformApiDefinitionName = gcPlatformApiDefinition["$ref"].match(regexes.DEFINITION_URI)[1];

			if (gcPlatformAPIDefinitionName in gcPlatformAPISpec.definitions === false) {
				throw new ReferenceError(`The definition "${gcPlatformAPIDefinitionName}" was not found in the Genesys Cloud Platform API object.`);
			}

			const parsedGCPlatformApiDefinition = parseGCPlatformApiDefinition(gcPlatformAPISpec.definitions[matchedGCPlatformApiDefinitionName]);

			gcPlatformAPIDefinitionsStack.pop();

			return parsedGCPlatformApiDefinition;
		}

		const parsedGCPlatformApiDefinition = {};

		for (const gcPlatformApiDefinitionKey in gcPlatformApiDefinition) {
			// Proceess the type property of the definition
			if (gcPlatformApiDefinitionKey === "type") {
				if ("format" in gcPlatformApiDefinition) {
					if (constants.gcPlatformAPIDataFormats.includes(gcPlatformApiDefinition.format) === false) {
						throw new RangeError(`"${gcPlatformApiDefinition.format}" is not a valid Genesys Cloud data format.`);
					}
					switch (gcPlatformApiDefinition.format) {
						case "date-time":
							parsedGCPlatformApiDefinition.bsonType = "date";
							break;
						case "local-date-time":
							parsedGCPlatformApiDefinition.bsonType = "date";
							break;
						case "date":
							parsedGCPlatformApiDefinition.bsonType = "string";
							break;
						case "local-time":
							parsedGCPlatformApiDefinition.bsonType = "string";
							break;
						case "float":
							parsedGCPlatformApiDefinition.bsonType = "double";
							break;
						case "int32":
							parsedGCPlatformApiDefinition.bsonType = "int";
							break;
						case "int64":
							parsedGCPlatformApiDefinition.bsonType = "long";
							break;
						case "uri":
							parsedGCPlatformApiDefinition.bsonType = "string";
							break;
						case "url":
							parsedGCPlatformApiDefinition.bsonType = "string";
							break;
						default: // Includes double
							parsedGCPlatformApiDefinition.bsonType = gcPlatformApiDefinition.format;
							break;
					}
				} else {
					if (constants.gcPlatformAPIDataTypes.includes(gcPlatformApiDefinition.type) === false) {
						throw new RangeError(`"${gcPlatformApiDefinition.type}" is not a valid Genesys Cloud data type.`);
					}
					switch (gcPlatformApiDefinition.type) {
						case "number":
							parsedGCPlatformApiDefinition.bsonType = "double";
							break;
						case "integer":
							parsedGCPlatformApiDefinition.bsonType = "long";
							break;
						case "boolean":
							parsedGCPlatformApiDefinition.bsonType = "bool";
							break;
						default: // Includes object, array, and string
							parsedGCPlatformApiDefinition.bsonType = gcPlatformApiDefinition.type;
							break;
					}
				}

				if ("allowEmptyValue" in gcPlatformApiDefinition) {
					parsedGCPlatformApiDefinition.bsonType = [parsedGCPlatformApiDefinition.bsonType, "null"];
				}

				continue;
			}

			// Ignore the format property as it was already processed when the type property was processed
			if (gcPlatformApiDefinitionKey === "format") {
				continue;
			}

			// Ignore the allowEmptyValue property as it was already processed when the type property was processed
			if (gcPlatformApiDefinitionKey === "allowEmptyValue") {
				continue;
			}

			if (gcPlatformApiDefinitionKey === "minimum") {
				parsedGCPlatformApiDefinition.minimum = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "maximum") {
				parsedGCPlatformApiDefinition.maximum = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "minItems") {
				parsedGCPlatformApiDefinition.minItems = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "maxItems") {
				parsedGCPlatformApiDefinition.maxItems = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "minLength") {
				parsedGCPlatformApiDefinition.minLength = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "maxLength") {
				parsedGCPlatformApiDefinition.maxLength = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "pattern") {
				parsedGCPlatformApiDefinition.pattern = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "required") {
				parsedGCPlatformApiDefinition.required = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "uniqueItems") {
				parsedGCPlatformApiDefinition.uniqueItems = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			// Ignore the readOnly property as it has no use for a MongoDB validator
			if (gcPlatformApiDefinitionKey === "readOnly") {
				continue;
			}

			// Ignore the position property as it has no use for a MongoDB validator
			if (gcPlatformApiDefinitionKey === "position") {
				continue;
			}

			if (gcPlatformApiDefinitionKey === "enum") {
				parsedGCPlatformApiDefinition.enum = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			if (gcPlatformApiDefinitionKey === "description") {
				parsedGCPlatformApiDefinition.description = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				continue;
			}

			// Ignore the example property as it has no use for a MongoDB validator
			if (gcPlatformApiDefinitionKey === "example") {
				continue;
			}

			if (gcPlatformApiDefinitionKey === "properties") {
				parsedGCPlatformApiDefinition.properties = {};
				const definitionProperties = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
				for (const definitionPropertyName in definitionProperties) {
					parsedGCPlatformApiDefinition.properties[definitionPropertyName] = parseGCPlatformApiDefinition(definitionProperties[definitionPropertyName]);
				}
				continue;
			}

			if (gcPlatformApiDefinitionKey === "additionalProperties") {
				if (typeof gcPlatformApiDefinition[gcPlatformApiDefinitionKey] === "object") {
					parsedGCPlatformApiDefinition.additionalProperties = parseGCPlatformApiDefinition(gcPlatformApiDefinition[gcPlatformApiDefinitionKey]);
					continue;
				}

				if (typeof gcPlatformApiDefinition[gcPlatformApiDefinitionKey] === "boolean") {
					parsedGCPlatformApiDefinition.additionalProperties = gcPlatformApiDefinition[gcPlatformApiDefinitionKey];
					continue;
				}

				throw new TypeError(`Unexpected "${gcPlatformApiDefinition[gcPlatformApiDefinitionKey]}" type for the additionalProperties property value.`);
			}

			if (gcPlatformApiDefinitionKey === "items") {
				parsedGCPlatformApiDefinition.items = parseGCPlatformApiDefinition(gcPlatformApiDefinition.items);
				continue;
			}

			// Ignore the x-genesys-entity-type property as it has no use for a MongoDB validator
			if (gcPlatformApiDefinitionKey === "x-genesys-entity-type") {
				continue;
			}

			// Ignore the x-genesys-search-fields property as it has no use for a MongoDB validator
			if (gcPlatformApiDefinitionKey === "x-genesys-search-fields") {
				continue;
			}

			throw new Error(`Definition has an unexpected property. Properties are ${Object.getOwnPropertyNames(gcPlatformApiDefinition)}`);
		}

		gcPlatformAPIDefinitionsStack.pop();

		return parsedGCPlatformApiDefinition;
	}
}

function getGCRegionURLs(gcRegion) {
	// Checks the passed region argument
	if (typeof gcRegion !== "string") {
		throw new TypeError("Invalid Genesys Cloud region argument type, it must be a string.");
	}

	let genesysCloudDomain = null;

	// Sets the Genesys Cloud domain corresponding to the passed region argument. Source: https://developer.genesys.cloud/platform/api/
	switch (gcRegion.toLowerCase()) {
		case "us-east-1": // US East (Virginia)
			genesysCloudDomain = "mypurecloud.com";
			break;
		case "us-east-2": // US East 2 (Ohio)
			genesysCloudDomain = "use2.us-gov-pure.cloud";
			break;
		case "us-west-2": // US West (Oregon)
			genesysCloudDomain = "usw2.pure.cloud";
			break;
		case "ca-central-1": // Canada (Central)
			genesysCloudDomain = "cac1.pure.cloud";
			break;
		case "eu-west-1": // Europe (Ireland)
			genesysCloudDomain = "mypurecloud.ie";
			break;
		case "eu-west-2": // Europe (London)
			genesysCloudDomain = "euw2.pure.cloud";
			break;
		case "eu-central-1": // Europe (Frankfurt)
			genesysCloudDomain = "mypurecloud.de";
			break;
		case "eu-central-2": // Europe (Zurich)
			genesysCloudDomain = "euc2.pure.cloud";
			break;
		case "ap-south-1": // Asia Pacific (Mumbai)
			genesysCloudDomain = "aps1.pure.cloud";
			break;
		case "ap-northeast-1": // Asia Pacific (Tokyo)
			genesysCloudDomain = "mypurecloud.jp";
			break;
		case "ap-northeast-2": // Asia Pacific (Seoul)
			genesysCloudDomain = "apne2.pure.cloud";
			break;
		case "ap-northeast-3": // Asia Pacific (Osaka)
			genesysCloudDomain = "apne3.pure.cloud";
			break;
		case "ap-southeast-2": // Asia Pacific (Sydney)
			genesysCloudDomain = "mypurecloud.com.au";
			break;
		case "sa-east-1": // South America (São Paulo)
			genesysCloudDomain = "sae1.pure.cloud";
			break;
		case "me-central-1": // Middle East (UAE)
			genesysCloudDomain = "mec1.pure.cloud";
			break;
		default:
			throw new RangeError("Invalid Genesys Cloud region.");
	}

	// Returns an object with the Genesys Cloud region URLs
	return {
		api: new URL(`https://api.${genesysCloudDomain}/`),
		apps: new URL(`https://apps.${genesysCloudDomain}/`),
		login: new URL(`https://login.${genesysCloudDomain}/`)
	};
}

module.exports = { loadGCPlatformAPISpecFromCloud, generateMongoDBJSONSchemaFromGCPlatformAPIDefinition, getGCRegionURLs };
