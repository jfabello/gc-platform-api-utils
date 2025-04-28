# Genesys Cloud platform API utilities for Node.js

The `gc-platform-api-utils` package provides utility functions to work with the Genesys Cloud platform API. It includes the following features:

- Loading the Genesys Cloud platform API specification from the cloud as a JavaScript object.
- Generating MongoDB JSON schemas for data validation from a Genesys Cloud platform API definition name. For example: "Queue", "AnalyticsConversation", and "AuditLogMessage".
- Getting the Genesys Cloud URLs for an AWS region.

## Table of Contents

- [What is New](#what-is-new)
  - [Version 0.5.0](#version-050)
  - [Version 0.4.0](#version-040)
  - [Version 0.3.0](#version-030)
  - [Version 0.2.0](#version-020)
  - [Version 0.1.0](#version-010)
- [Installation](#installation)
- [Usage](#usage)
  - [Loading the Genesys Cloud API specification from the cloud](#loading-the-genesys-cloud-api-specification-from-the-cloud)
  - [Generating MongoDB JSON schemas for data validation](#generating-mongodb-json-schemas-for-data-validation)
  - [Get the Genesys Cloud region URLs](#get-the-genesys-cloud-region-urls)
- [`generateMongoDBJSONSchema()` function](#generatemongodbjsonschema-function)
  - [Parameters](#parameters)
  - [Returns](#returns)
  - [Throws](#throws)
- [`getGCRegionURLs()` function](#getgcregionurls-function)
  - [Parameters](#parameters-1)
  - [Returns](#returns-1)
  - [Throws](#throws-1)
- [`loadGCPlatformAPISpecFromCloud()` function](#loadgcplatformapispecfromcloud-function)
  - [Parameters](#parameters-2)
  - [Returns](#returns-2)
  - [Throws](#throws-2)
- [`errors` object](#errors-object)
- [`gcRegions` object](#gcregions-object)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## What is New

### Version 0.5.0

- The Genesys Cloud platform API utilities for Node.js is now an ES6 module. This provides better support for tools like ESLint 9 and a cleaner code syntax.
- Updated the minimum Node.js engine version required to 20.

### Version 0.4.0

- Renamed the named exports `GC_PLATFORM_API_UTILS_ERRORS` to `errors`, and `GC_REGIONS` to `gcRegions`.

### Version 0.3.0

- Code refactoring.
- Renamed the Genesys Cloud API utilities error object to `GC_PLATFORM_API_UTILS_ERRORS` to make it more noticeable that it is a constant.
- Added the `GC_REGIONS` object to make it easier to know the available Genesys Cloud regions


### Version 0.2.0

- Added `gcPlatformAPIUtilsErrors` to the objects exported by the gc-platform-api-utils module.

### Version 0.1.0

- Initial release.

## Installation

You can install this module via `npm`:

```shell
npm install @jfabello/gc-platform-api-utils
```

## Usage

To use the `gc-platform-api-utils` package, import one, some or all of its functions.

### Loading the Genesys Cloud API specification from the cloud

```javascript
import { loadGCPlatformAPISpecFromCloud } from '@jfabello/gc-platform-api-utils';

const gcRegion = 'us-east-1';
const gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(gcRegion);

console.log(gcPlatformAPISpec);
```

### Generating MongoDB JSON schemas for data validation

```javascript
import { loadGCPlatformAPISpecFromCloud, generateMongoDBJSONSchema } from '@jfabello/gc-platform-api-utils';

const gcRegion = 'us-east-1';
const gcPlatformAPISpec = await loadGCPlatformAPISpecFromCloud(gcRegion);
const gcPlatformAPIDefinitionName = 'Queue';
const mongoDBJSONSchema = generateMongoDBJSONSchema(gcPlatformAPISpec, gcPlatformAPIDefinitionName);

console.log(mongoDBJSONSchema);
```

### Get the Genesys Cloud region URLs

```javascript
import { getGCRegionURLs } from '@jfabello/gc-platform-api-utils';

const gcRegion = 'us-east-1';
const gcRegionURLs = getGCRegionURLs(gcRegion);

console.log(gcRegionURLs);
```

## `generateMongoDBJSONSchema()` function

Generates a MongoDB JSON schema from a Genesys Cloud Platform API definition.

### Parameters

- `gcPlatformAPISpec`: The Genesys Cloud Platform API specification object.
- `gcPlatformAPIDefinitionName`: The name of the Genesys Cloud Platform API definition.

### Returns

A MongoDB JSON schema object.

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

A Genesys Cloud region URLs object with the following properties:

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

## `errors` object

This object contains all the errors tha can be thrown by the Genesys Cloud Platform API utilities functions.

| Class Name                                                   | Message                                                      | Parent Class     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------- |
| `ERROR_GC_REGION_TYPE_INVALID`                               | The Genesys Cloud region type is not valid, it must be a string. | `TypeError`      |
| `ERROR_GC_REGION_INVALID`                                    | The Genesys Cloud region ${gcRegion} is not valid.           | `TypeError`      |
| `ERROR_TIMEOUT_TYPE_INVALID`                                 | The timeout type is not valid, it must be a positive integer. | `TypeError`      |
| `ERROR_TIMEOUT_OUT_OF_BOUNDS`                                | The timeout type is not valid, it must be a positive integer. | `RangeError`     |
| `ERROR_GENESYS_CLOUD_SERVICES_ERROR`                         | An error occurred on the Genesys Cloud services side.        | `Error`          |
| `ERROR_HTTP_CLIENT_ERROR`                                    | An error occurred on the HTTP client side.                   | `Error`          |
| `ERROR_GC_PLATFORM_API_SPEC_TYPE_INVALID`                    | Invalid Genesys Cloud platform API specification type, it must be an object. | `TypeError`      |
| `ERROR_GC_PLATFORM_API_DEFINITION_TYPE_INVALID`              | Invalid Genesys Cloud platform API definition type, it must be an object. | `TypeError`      |
| `ERROR_GC_PLATFORM_API_DEFINITION_NAME_TYPE_INVALID`         | Invalid Genesys Cloud platform API definition name type, it must be a string. | `TypeError`      |
| `ERROR_GC_PLATFORM_API_SPEC_DEFINITIONS_PROPERTY_MISSING`    | The Genesys Cloud platform API specification object is missing the "definitions" property. | `ReferenceError` |
| `ERROR_GC_PLATFORM_API_DEFINITION_NOT_FOUND_IN_SPEC`         | The definition "${definition}" was not found in the Genesys Cloud Platform API specification object. | `ReferenceError` |
| `ERROR_GC_PLATFORM_API_DEFINITION_URI_INVALID`               | The URI "${definitionURI}" is not a valid Genesys Cloud platform API definition URI. | `ReferenceError` |
| `ERROR_GC_PLATFORM_API_DEFINITION_FORMAT_PROPERTY_VALUE_INVALID` | The Genesys Cloud platform API definition "format" property value "${formatValue}" is not valid. | `RangeError`     |
| `ERROR_GC_PLATFORM_API_DEFINITION_TYPE_PROPERTY_VALUE_INVALID` | The Genesys Cloud platform API definition "type" property value "${typeValue}" is not valid. | `RangeError`     |
| `ERROR_GC_PLATFORM_API_DEFINITION_PROPERTY_INVALID`          | The Genesys Cloud platform API definition property "${property}" is not valid. | `RangeError`     |
| `ERROR_GC_PLATFORM_API_DEFINITION_AP_PROPERTY_VALUE_TYPE_INVALID` | The Genesys Cloud Platform API definition "additionalProperties" property value type is not valid, it must be an object or a boolean. | `TypeError`      |

## `gcRegions` object

This object contains all the Genesys Cloud regions as an array of strings.

| Region           | Location                  |
|------------------|---------------------------|
| `us-east-1`      | US East (N. Virginia)     |
| `us-east-2`      | US East (Ohio)            |
| `us-west-2`      | US West (Oregon)          |
| `ca-central-1`   | Canada (Central)          |
| `eu-west-1`      | EU (Ireland)              |
| `eu-west-2`      | EU (London)               |
| `eu-central-1`   | EU (Frankfurt)            |
| `eu-central-2`   | EU (Zurich)               |
| `ap-south-1`     | Asia Pacific (Mumbai)     |
| `ap-northeast-1` | Asia Pacific (Tokyo)      |
| `ap-northeast-2` | Asia Pacific (Seoul)      |
| `ap-northeast-3` | Asia Pacific (Osaka)      |
| `ap-southeast-2` | Asia Pacific (Sydney)     |
| `sa-east-1`      | South America (São Paulo) |
| `me-central-1`   | Middle East (Central)     |


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
