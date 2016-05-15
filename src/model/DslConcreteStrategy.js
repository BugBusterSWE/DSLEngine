/*
* Name : DslConcreteStrategy.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/controller/middleware
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.1          2015-05-15     Andrea Mantovani
* -------------------------------------------------
* Aggiornata elaborazione dsl con Sweet.js 1.x
* =================================================
* 0.0.1          2015-05-11     Andrea Mantovani
* -------------------------------------------------
* Rimosso metodo init
* =================================================
* 0.0.1          2014-03-01     Luca De Franceschi
* -------------------------------------------------
* Codifica modulo
* =================================================
*/

"use strict";

var SweetjsCompiler = require("sweetjs-compiler");
var fs = require("fs");
var MaapError = require("../utils/MaapError.js");
var vm = require("vm");

var DslCollectionModel = require("./DslCollectionModel");
var IndexModel = require("./IndexModel");
var ShowModel = require("./ShowModel");
var Row = require("./Row");
var Column = require("./Column");

var DslConcreteStrategy = function() {
	this.sweetjs = new SweetjsCompiler({
		ambient: __dirname	
	});

	try {
    	this.cachedMacro = fs.readFileSync(`${__dirname}/macro.sjs`, "utf-8");
	} catch (err) {
		throw new MaapError(err);	
	}
};

DslConcreteStrategy.prototype.loadDSL = function(content, domain, callback, errback) {
	// Inject the macro syntax into the content
	content = `${this.cachedMacro}\n\n${content}`;

	var out = null;
	try {
		out = this.sweetjs.compile(content);
	} catch(err) {
		errback(new MaapError(err));
		return;
	}

	var collections = [];
	var registerCollection = function(coll) {
		collections.push(coll);
	};

	try {
		vm.runInNewContext(out.code, {
			registerCollection: registerCollection,
			require: require,
			DslCollectionModel: DslCollectionModel,
			IndexModel: IndexModel,
			ShowModel: ShowModel,
			Row: Row,
			Column: Column,
			domain: domain
		});
	} catch(err) {
		errback(new MaapError(err));
		return;
	}

	callback(collections);
};

module.exports = DslConcreteStrategy;

