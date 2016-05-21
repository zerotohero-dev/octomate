"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 *          __,-“”-.__
 *     |\  / ,-.  ,-. \  /|
 *     )o)( ( o )( o ) )(o(
 *    /o/ |  `-'  `-'  | \o\
 *    \ \/   OctOmate   \/ /
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * This project is a part of the “Byte-Sized JavaScript” videocast.
 *
 * You can watch “Byte-Sized JavaScript” at: < https://bit.ly/bytesized >
 *
 * MIT Licensed — See LICENSE.md
 *
 * Send your comments, suggestions, and feedback to <me@volkan.io>.
 */

var log = function log() {
  for (var _len = arguments.length, stuff = Array(_len), _key = 0; _key < _len; _key++) {
    stuff[_key] = arguments[_key];
  }

  return console.log("\n ● " + stuff + "\n");
};
var info = function info() {
  var _console;

  return (_console = console).info.apply(_console, arguments);
};
var error = function error() {
  for (var _len2 = arguments.length, stuff = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    stuff[_key2] = arguments[_key2];
  }

  return console.error("\n ● " + stuff + "\n");
};

exports.log = log;
exports.info = info;
exports.error = error;

//# sourceMappingURL=log.js.map