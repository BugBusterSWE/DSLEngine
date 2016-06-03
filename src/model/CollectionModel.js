/*
* Name : DslCollectionModel.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.1           2014-03-01     Giacomo Fornari
* -------------------------------------------------
* Codifica modulo
* =================================================
* 0.0.2           2014-03-01     Luca De Franceschi
* -------------------------------------------------
* Incremento metodi
* =================================================
*/

"use strict";

var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var ShowModel = require("./ShowModel");
var IndexModel = require("./IndexModel");
var MaapError = require("../utils/MaapError");

var CollectionModel = function(params, connection) {
    var self = this;
    
    // Valori di default
    this.weight = 0;

    this.showModel = new ShowModel({}, this);
    this.indexModel = new IndexModel({}, this);

    // Leggi i parametri obbligatori e opzionali
    AttributeReader.readRequiredAttributes(params, this, ["name", "label"], function(param){
	throw new MaapError(8000, "Required parameter '" + param + "' in collection '" + self.toString() + "'");
    });

    AttributeReader.readOptionalAttributes(params, this, ["weight"]);

    AttributeReader.assertEmptyAttributes(params, function(param){
	throw new MaapError(8000, "Unexpected parameter '" + param + "' in collection '" + self.toString() + "'");
    });
    
    if (this.weight === undefined) {
	this.weight = 0;
    }

    this.model = connection.model(this.name, DocumentSchema);
    this.id = hash(new Date().getMilliseconds());
};

CollectionModel.prototype.getId = function() {
	return this.id;
};

CollectionModel.prototype.getName = function() {
	return this.name;
};

CollectionModel.prototype.getLabel = function() {
	return this.label;
};

CollectionModel.prototype.getWeight = function() {
	return this.weight;
};

CollectionModel.prototype.getIndexModel = function() {
	return this.indexModel;
};

CollectionModel.prototype.getShowModel = function() {
	return this.showModel;
};

CollectionModel.prototype.setIndexModel = function(indexModel) {
	this.indexModel = indexModel;
};

CollectionModel.prototype.setShowModel = function(showModel) {
	this.showModel = showModel;
};

CollectionModel.prototype.toString = function() {
	return `Collection ${this.getLabel()}`;
};

module.exports = CollectionModel;

