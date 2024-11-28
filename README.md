# Genesys Cloud platform API utilities for Node.js

## Description

The `gc-platform-api-utils` package provides utility functions to work with the Genesys Cloud platform API. It includes the following features:

- Loading the Genesys Cloud platform API specification from the cloud as a JavaScript object.
- Generating MongoDB JSON schemas for data validation from a Genesys Cloud platform API definition name. For example: "Queue", "AnalyticsConversation", and "AuditLogMessage".
- Getting the Genesys Cloud URLs for an AWS region.

## Installation

You can install this module via `npm`:

```shell
npm install @jfabello/gc-platform-api-utils
```

## Usage

To use the `gc-platform-api-utils` package, import one, some or all of its functions.

### Loading the Genesys Cloud API specification from the cloud

```javascript
const { loadGCPlatformAPISpecFromCloud } = require('@jfabello/gc-platform-api-utils');

async main() {
    const gcRegion = 'us-east-1';
    const gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(gcRegion);
    console.log(gcPlatformAPISpec);
}

main();
```

### Generating MongoDB JSON schemas for data validation

```javascript
const { loadGCPlatformAPISpecFromCloud, generateMongoDBJSONSchema } = require('@jfabello/gc-platform-api-utils');

async main() {
    const gcRegion = 'us-east-1';
    const gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(gcRegion);
	const gcPlatformAPIDefinitionName = 'Queue';
	const mongoDBJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, gcPlatformAPIDefinitionName);
	console.log(mongoDBJSONSchema);
}

main();
```

### Get the Genesys Cloud region URLs

```javascript
const { getGCRegionURLs } = require('@jfabello/gc-platform-api-utils');

async main() {
	const gcRegion = 'us-east-1';
	const gcRegionURLs = getGCRegionURLs(gcRegion);
	console.log(gcRegionURLs);
}

main();
```

## `generateMongoDBJSONSchema()` function

Generates a MongoDB JSON schema from a Genesys Cloud Platform API definition.

### Parameters

- `gcPlatformAPISpec`: The Genesys Cloud Platform API specification object.
- `gcPlatformAPIDefinitionName`: The name of the Genesys Cloud Platform API definition.

### Returns

The MongoDB JSON schema object.

### Throws

- `ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID`: If the Genesys Cloud Platform API specification is not an object.
- `ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING`: If the Genesys Cloud Platform API specification does not have a "definitions" property.
- `ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID`: If the Genesys Cloud Platform API definition name is not a string.
- `ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC`: If the Genesys Cloud Platform API definition name is not found in the specification.
- `ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID`: If the Genesys Cloud Platform API definition is not an object.
- `ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID`: If the Genesys Cloud Platform API definition "format" property value is not valid.
- `ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID`: If the Genesys Cloud Platform API definition "type" property value is not valid.
- `ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID`: If the Genesys Cloud Platform API definition "additionalProperties" property value type is not valid.
- `ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID`: If the Genesys Cloud Platform API definition URI is not valid.
- `ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID`: If a property of the Genesys Cloud Platform API definition is not valid.

## `getGCRegionURLs()` function

Gets the Genesys Cloud URLs (API, apps, and login) for the specified Genesys Cloud region.

### Parameters

- `gcRegion`: The Genesys Cloud region.

### Returns

The Genesys Cloud region URLs object with the following properties:
- `api`: The API server URL
- `apps`: The Apps URL
- `login`: The Auth server URL

### Throws

- `ERROR_GC_REGION_TYPE_INVALID`: If the Genesys Cloud region is not a string.
- `ERROR_GC_REGION_INVALID`: If the Genesys Cloud region is not a valid region.


## `loadGCPlatformAPISpecFromCloud()` function

Loads the Genesys Cloud Platform API specification from the Genesys Cloud servers.

### Parameters

- `gcRegion`: The Genesys Cloud region to load the API specification from.
- `options`: Optional parameters.
	- `timeout`: The optional HTTP request timeout in milliseconds. The default is 60 seconds.

### Returns

A promise that resolves to an object with the Genesys Cloud Platform API specification, or rejects to an error if the operation fails.

### Throws

- `ERROR_GC_REGION_TYPE_INVALID`: If the `gcRegion` argument is not a string.
- `ERROR_TIMEOUT_TYPE_INVALID`: If the `timeout` argument is not a number or not an integer.
- `ERROR_TIMEOUT_OUT_OF_BOUNDS`: If the `timeout` argument is less than 1 milliseconds.
- `ERROR_HTTP_CLIENT_ERROR`: If there is an error with the HTTP client.
- `ERROR_GENESYS_CLOUD_SERVICES_ERROR`: If there is an error with the Genesys Cloud services.

## Testing

To run the tests for this module, first clone the repository using the following command:

```shell
git clone https://github.com/jfabello/gc-platform-api-utils.git
```

Then, navigate to the project directory and install the npm dependencies, this will install the Jest testing framework:

```shell
cd gc-platform-api-utils
npm install
```

Finally, run the tests using the following command:

```shell
npm test
```

## Contributing

Unfortunately, we are not able to accept contributions at this time.

If you find a bug in the code, please open an issue.

Thank you for your understanding.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


