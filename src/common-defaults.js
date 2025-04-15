/**
 * Genesys Cloud platform API utilities for Node.js common defaults.
 * @module gc-platform-api-utils-defaults
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Set strict mode
"use strict";

const defaults = {};

defaults.DEFAULT_HTTP_TIMEOUT = 60 * 1000; // 60 seconds

Object.freeze(defaults);

export { defaults };
