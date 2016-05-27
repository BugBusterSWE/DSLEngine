/*
* Name : DslDomain.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
* 
* Version         Date           Programmer
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

var DslDomain = function(db) {
    this.db = db;
    this.modelRegistry = {};
    this.strategy = new DslConcreteStrategy();
    this.id = 0;
};

DslDomain.prototype.loadDSL = function(data, callback) {
    var self = this;
    self.strategy.loadDSL(data, self, function(collections) {
	var ids = [];

	collections.forEach(function(model) {
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
    
    return idc;
};

DslDomain.prototype.getCollectionModel = function(collectionId) {
	return this.modelRegistry[collectionId];
};

var compareCollectionWeight = function(a, b) {
	var aw = a.getWeight();
	var bw = b.getWeight();
	if (aw < bw) {
		return -1;
	}
	if (aw > bw) {
		return 1;
	}
	return 0;
};

DslDomain.prototype.getCollectionModels = function() {
	var models = [];

	for (var id in this.modelRegistry) {
		if (this.modelRegistry.hasOwnProperty(id)) {
			models.push(this.modelRegistry[id]);
		}
	}
	models.sort(compareCollectionWeight);
	
	return models;
};

module.exports = DslDomain;
