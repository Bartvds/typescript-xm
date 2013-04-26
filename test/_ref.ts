///<reference path="../typings/DefinitelyTyped/node/node.d.ts" />
///<reference path="../typings/DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="../typings/DefinitelyTyped/mocha/mocha.d.ts" />
///<reference path="../typings/DefinitelyTyped/chai/chai-assert.d.ts" />

declare interface Window {
	_:any;
	chai:any;
}

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
	// NodeJS
	var chai = require('chai');
	var _ = require('underscore');
	chai.use(require('chai-fuzzy'));
}
else {
	// Browser
	var chai = window.chai;
	var _ = window._;
}

var assert = chai.assert;
