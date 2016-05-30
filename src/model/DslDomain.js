/*
* Name : DslDomain.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.1          2016-05-30     Davide Polonio
* -------------------------------------------------
* Corretto typo. Trovato errore in `new Engine()`
* =================================================
* 0.0.1          2016-05-11     Andrea Mantovani
* -------------------------------------------------
* Rimosso metodo init
* Rinominato metodo DslLoadFile in DslLoad
* =================================================
* 0.0.1          2014-03-01     Federico Poli
* -------------------------------------------------
* Codifica modulo
* =================================================
*/

"use strict";

var DslConcreteStrategy = require("./DslConcreteStrategy");
var MaapError = require("../utils/MaapError.js");

var _prefix = "_id";

var DslDomain = function() {
    this.modelRegistry = {};
    this.strategy = new DslConcreteStrategy();
    this.id = 0;
};

DslDomain.prototype.loadDSL = function(data, callback) {
    var self = this;
    self.strategy.loadDSL(data, function(models) {
		var ids = []

		models.forEach(function(model) {
			ids.push(self.register(model));
		});

		callback(undefined, ids);

    }, function(maaperror) {
		callback(maaperror, undefined);
    });
};

DslDomain.prototype.register = function(model) {
    var idc = `${_prefix}${this.id++}`;
    this.modelRegistry[idc] = model;
    
    return {
		token: idc,
		type: model.constructor.name
	};
};

DslDomain.prototype.getByToken = function(token) {
	return this.modelRegistry[token];
};

DslDomain.prototype.getAll = function() {
	return this.modelRegistry;
};

module.exports = DslDomain;
