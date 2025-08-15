"use strict";
(() => {
var exports = {};
exports.id = 7155;
exports.ids = [7155];
exports.modules = {

/***/ 97783:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@edge-runtime/cookies");

/***/ }),

/***/ 28530:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@opentelemetry/api");

/***/ }),

/***/ 54426:
/***/ ((module) => {

module.exports = require("next/dist/compiled/chalk");

/***/ }),

/***/ 40252:
/***/ ((module) => {

module.exports = require("next/dist/compiled/cookie");

/***/ }),

/***/ 32196:
/***/ ((module) => {

module.exports = require("next/dist/compiled/ua-parser-js");

/***/ }),

/***/ 14021:
/***/ ((module) => {

module.exports = import("next/dist/compiled/@vercel/og/index.node.js");;

/***/ }),

/***/ 25085:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "headerHooks": () => (/* binding */ headerHooks),
  "originalPathname": () => (/* binding */ originalPathname),
  "requestAsyncStorage": () => (/* binding */ requestAsyncStorage),
  "routeModule": () => (/* binding */ routeModule),
  "serverHooks": () => (/* binding */ serverHooks),
  "staticGenerationAsyncStorage": () => (/* binding */ staticGenerationAsyncStorage),
  "staticGenerationBailout": () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!./src/app/favicon.ico?__next_metadata
var favicon_next_metadata_namespaceObject = {};
__webpack_require__.r(favicon_next_metadata_namespaceObject);
__webpack_require__.d(favicon_next_metadata_namespaceObject, {
  "GET": () => (GET),
  "dynamic": () => (dynamic)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(35387);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(29267);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/server.js
var server = __webpack_require__(14664);
;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!./src/app/favicon.ico?__next_metadata


const contentType = "image/x-icon"
const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ0SURBVHgB7Zo9bBxVEMf/8+7OIdgSh8SlASkWUiiQkR0JaCiwKwQNIKiQIi4NEl0KJDqC6ehIS4NRWgpXSFQxfSQ7EFKARC5SksIpckU+FO/tTmbe3vq+fJ+eu1vJ7yd5b3V73tv537yZ994MEAgEAoFAIBAInEgIx+H6VyW8FJXxjF9Fwy2hwGXEvIAClfz1mCOcco8QIwLF+1hw+zj3y4O+99utllHEGsh9DKJlgNfAKMuVcvMTdXnkmn9l/hNIdvDW1g6OwWQC/HexkhqN1w+NHRUVpVi4iyj+F+e36v69v6vr3migipaxo6L32BYxrmBlaw9jMp4A3nBaEfXPwAKiV+TwufzS6zCBdkTYiyJsbeT/GOlT6uqn4xUkyRuwIOZFlAqfiZAfYTr8hCjZPPSwAQwX4MaFRbjihpwtwgJGBY6+k7MKpgmhhoNkY5g3uEEX8dcXL4MLH8DKeMJZMf5HTNt4hbEsQfcablbXMPCR+qHGJwsbYwe5/t90Vg6X5exFzBYZBuIJfQLk0R6gbk+n3jMzXt0e9A1mb7wiWUU8Ybe6fNTFXgE04FmOeQ14sxjzgyn74aDzjC56BdBob2W8otF+vsanaEwoucvdb3cKoK5vlerSL61MMdVNwiU/6WqjU4BC6V1Y4uhr5A2iDi9oCaDjw2qGpzAvy/FN5A5ab/eClgAlQ9f33+M+RF4h+iQ7bQnQcK/BlneQW+jLLCOkAugixyrn+/uL69Nccv6opMtuZAIcJHZjPyWHY7+L5jBIBeCCsQCUfwEg8wIcCgA790+xm0hNC6JVfUkFiJMlWMI5mPkNI91qawpgGQCVfAfAjDYBTjDNISAblZYwniD/+O2y5hBIDmAJ4TFyj99ebwpA9BCWMO4g/7R5ALGtyzreR97xhZVMgAbfgyWM68g9UlVCJkB0+qFpINQt6XwHwnpWUksFePvnSJbDt2FFIsY73kF+2c5O2pbDJ2kYSB2xSUuA1av7kg3sghfjlhxvIXdI/bCtRtA5E4yjf2AK/4a8ocXTNjoFUC9wUra2Qr2A+HfkBr7SXSvsXQs8feGmHC1ncuoFDzB/aoj4++43ewXQjJA0rpmlRc0I4B/mnBbFeF8p7imXH70aXL36GO7ATgQWDyDenJMIdTH+035l8sH9AVoh1iKpZXk8LZLOasOk3vzl9/o/0jCsGyTIV4pnUSzN3L426EPDN0R0ODwr/WGWHdLh8O10s4NE+yg5P0qv0HhNUuoNWj+0KqE5YrDWDw2bpDjeHKd1brI2OY0NrnjOV5MmapPD/4jj+37eoexW1+Q+l0QQbZUbv02O+VcRcXuSnsHjNUoqNy6cQdFVfG2B4xJiWupolNTdJipqm8ojb7SuPDXV9sMXLt26TMvfhxfDF1lbjZIkfwlJUEvueKMb2BulGywQCAQCgUAgEAh08BwRYGjI/Fqj7AAAAABJRU5ErkJggg==", 'base64'
  )

function GET() {
  return new server.NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': "public, max-age=0, must-revalidate",
    },
  })
}

const dynamic = 'force-static'

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Ffavicon.ico%2Froute&name=app%2Ffavicon.ico%2Froute&pagePath=private-next-app-dir%2Ffavicon.ico&appDir=C%3A%5CUsers%5Cavinash%20singh%20patel%5CDesktop%5CnewBuild%5Cmmv_freelance_frontend%5Csrc%5Capp&appPaths=%2Ffavicon.ico&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: favicon_next_metadata_namespaceObject,
    pathname: "/favicon.ico",
    resolvedPagePath: "next-metadata-route-loader?page=%2Ffavicon.ico%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!C:\\Users\\avinash singh patel\\Desktop\\newBuild\\mmv_freelance_frontend\\src\\app\\favicon.ico?__next_metadata",
    nextConfigOutput: undefined,
  })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/favicon.ico/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [9405,4572], () => (__webpack_exec__(25085)));
module.exports = __webpack_exports__;

})();