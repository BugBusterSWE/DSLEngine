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
var vm = require("vm");

var CollectionModel = require("./CollectionModel");
var DocumentModel = require("./DocumentModel");
var DSLSyntaxException = require("../utils/dslSyntaxException");
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

DslConcreteStrategy.prototype.load = function(content, connection) {
    // Inject the macro syntax into the content
    content = `${this.cachedMacro}\n\n${content}`;

    var out = null;
    try {
	out = this.sweetjs.compile(content);
    } catch(err) {
	throw new DSLSyntaxException(err);
    }

    var models = [];

    var registerModel = function (dsl) {
	models.push(dsl);
    };

    try {
	vm.runInNewContext(out.code, {
	    registerModel: registerModel,
	    require: require,
	    db: connection,
	    CollectionModel: CollectionModel,
	    DocumentModel: DocumentModel,
	    IndexModel: IndexModel,
	    ShowModel: ShowModel,
	    Row: Row,
	    Column: Column
	});
    } catch(err) {
	throw err;
    }

    return models;
};

module.exports = DslConcreteStrategy;

