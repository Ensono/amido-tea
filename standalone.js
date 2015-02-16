/*
 *
 * This is used to build the bundle with browserify.
 *
 */
var AmidoTea = require('./');

if (typeof global.window.define == 'function' && global.window.define.amd) {
    global.window.define('AmidoTea', function () { return AmidoTea; });
} else if (global.window) {
    global.window.AmidoTea = AmidoTea;
}