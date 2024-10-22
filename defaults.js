/**
 * @module gc-platform-api-defaults
 * @description Genesys Cloud platform API utilities
 * @license GPL-3.0-only
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

const defaults = {};

defaults.DEFAULT_HTTP_TIMEOUT = 60 * 1000; // 60 seconds

Object.freeze(defaults);

module.exports = defaults;
