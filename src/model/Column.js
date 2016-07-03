/*
* Name : Column.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.1         2014-03-01      Serena Girardi
* -------------------------------------------------
* Codifica modulo
* =================================================
*/

"use strict";

var AttributeReader = require("../utils/AttributeReader");
var RequiredParamException = require("../utils/requiredParamException");
var UnexpectedParamException = require("../utils/unexpectedParamException");
var WrongTypeException = require("../utils/wrongTypeException");

var identity = function(x) { return x; };

var Column = function(params, parent) {
    var self = this;
    this.parent = parent;
    parent.addColumn(this);
    
    // Valori di default
    this.selectable = false;
    this.sortable = false;
    this.transformation = identity;

    // Leggi i parametri obbligatori e opzionali
    AttributeReader.readRequiredAttributes(params, this, ["name"], (param) => {
	throw new RequiredParamException(this, param);
    });
    AttributeReader.readOptionalAttributes(params, this, ["label", "sortable", "transformation", "selectable"]);
    AttributeReader.assertEmptyAttributes(params, (param) => {
	throw new UnexpectedParamException(this, param);
    });

    // Valori di default
    if (this.label === undefined) {
	this.label = this.name;
    }
    
    // Controllo dei tipi
    if (typeof this.label !== 'string' ||
	typeof this.name !== 'string' ||
	typeof this.transformation !== 'function' ||
	typeof this.selectable !== 'boolean' ||
	typeof this.sortable !== 'boolean'
       ) {
	throw new WrongTypeException(this);
    }
};

Column.prototype.getLabel = function() {
    return this.label;
};

Column.prototype.getName = function() {
    return this.name;
};

Column.prototype.getTransformation = function() {
    return this.transformation;
};

Column.prototype.isSelectable = function() {
    return this.selectable;
};

Column.prototype.isSortable = function() {
    return this.sortable;
};

Column.prototype.toString = function() {
    return `Column ${this.getName()} of ${this.parent.toString()}`;
};

Column.prototype.setSelectable = function(selectable) {
    this.selectable = selectable;
};

module.exports = Column;
