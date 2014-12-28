/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.require
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */
var AmidoTea = require('./');

// use amd or just throught to window object.
if (typeof global.window.define == 'function' && global.window.define.amd) {
    global.window.define('AmidoTea', function () { return AmidoTea; });
} else if (global.window) {
    global.window.AmidoTea = AmidoTea;
}