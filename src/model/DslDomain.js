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
var MaapError = require("../../utils/MaapError.js");
var fs = require("fs");

var DslDomain = function(db) {
	this.db = db;
	this.modelRegistry = {};
	this.strategy = new DslConcreteStrategy();
};

DslDomain.prototype.loadDSL = function(data, callback) {
    var self = this;
    self.strategy.loadDSLFile(data, self, function(collections) {
	collections.forEach(function(model) {
	    self.registerCollection(model);
	});
    }, function(maaperror) {
	self.registerError(maaperror);
    });
};
DslDomain.prototype.registerError = function(error) {
	this.errors.push(error);
};

DslDomain.prototype.registerCollection = function(model) {
	var id = model.getId();

	if (this.modelRegistry[id] !== undefined) {
		 this.registerError(new MaapError(
		    3001, 
		    "The collection '"+model.getName()+"' with id '"+id+"' is defined multiple times"
		));
	}
	
	this.modelRegistry[id] = model;
	model.indexModel.noMoreColumns();
	model.showModel.noMoreRows();
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

DslDomain.prototype.getErrors = function() {
	return this.errors;
};

module.exports = DslDomain;
