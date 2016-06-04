/*
* Name : Row.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
*
* Version         Date           Programmer
* =================================================
* 0.0.1          2014-03-02     Enrico Rotundo
* -------------------------------------------------
* Codifica modulo
* =================================================
*/

"use strict";

var AttributeReader = require("../utils/AttributeReader");
var MaapError = require("../utils/MaapError");

var identity = function(x) { return x; };

var Row = function(params, parent) {
	var self = this;
	this.parent = parent;
    this.parent.addRow(this);
	
	// Valori di default
	this.transformation = identity;

	// Leggi i parametri obbligatori e opzionali
	AttributeReader.readRequiredAttributes(params, this, ["name"], function(param){
		throw new MaapError(
            16000, 
            `Required parameter '${param}' in row ${self.toString()} of '${this.parent.toString()}'`
        );
	});
	AttributeReader.readOptionalAttributes(params, this, ["label", "transformation"]);
	AttributeReader.assertEmptyAttributes(params, function(param){
		throw new MaapError(
            16000, 
            `Unexpected parameter '${param}' in row '${self.toString()}' of '${parent.toString()}'`
        );
	});

	// Valori di default
	if (this.label === undefined) {
		this.label = this.name;
	}
	
	// Controllo dei tipi
	if (typeof this.label !== 'string' ||
		typeof this.name !== 'string' ||
		typeof this.transformation !== 'function'
	) {
		throw new MaapError(
            16000, 
            `Parameter with a wrong type in row '${this.toString()}' of '${this.parent.toString()}'`
        );
	}
};

Row.prototype.getLabel = function() {
	return this.label;
};

Row.prototype.getName = function() {
	return this.name;
};

Row.prototype.getTransformation = function() {
	return this.transformation;
};

Row.prototype.toString = function() {
	return this.getName();
};

module.exports = Row;
