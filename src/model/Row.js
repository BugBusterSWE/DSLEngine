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
var RequiredParamException = require("../utils/requiredParamException");
var UnexpectedParamException = require("../utils/unexpectedParamException");
var WrongTypeException = require("../utils/wrongTypeException");

var identity = function(x) { return x; };

var Row = function(params, parent) {
    var self = this;
    this.parent = parent;
    this.parent.addRow(this);
    
    // Valori di default
    this.transformation = identity;

    // Leggi i parametri obbligatori e opzionali
    AttributeReader.readRequiredAttributes(params, this, ["name"], (param) => {
	throw new RequiredParamException(this, param);
    });
    AttributeReader.readOptionalAttributes(params, this, ["label", "transformation"]);
    AttributeReader.assertEmptyAttributes(params, (param) => {
	throw new UnexpectedParamException(this, param);
    });

    // Valori di default
    if (this.label === undefined) {
	this.label = this.name;
    }
    
    // Controllo dei tipi
    if (typeof this.label !== 'string' ||C
	typeof this.name !== 'string' ||
	typeof this.transformation !== 'function'
       ) {
	throw new WrongTypeException(this);
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
    return `Row ${this.getName()} of ${this.parent.toString()}`;
};

module.exports = Row;
