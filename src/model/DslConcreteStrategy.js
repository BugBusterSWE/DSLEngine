/*
* Name : DslConcreteStrategy.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/controller/middleware
*
* History :
* 
* Version         Date           Programmer
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

var sweetjs = require("sweet.js");
var fs = require("fs");
var MaapError = require("../utils/MaapError.js");
var vm = require("vm");

var DslCollectionModel = require("./DslCollectionModel");
var IndexModel = require("./IndexModel");
var ShowModel = require("./ShowModel");
var Row = require("./Row");
var Column = require("./Column");

var intepreterFile = __dirname + "/macro.sjs";

var DslConcreteStrategy = function() {
	fs.readFile(intepreterFile, function(err, data) {
		if (err) {
			throw new MaapError(err);
		}
		else {
			this.macro = sweetjs.loadModule(data);
		}
	});
};

DslConcreteStrategy.prototype.loadDSL = function(content, domain, callback, errback) {
	var out = null;
	try {
		out = sweetjs.compile(content, {
			modules: [this.macro]
		});
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
