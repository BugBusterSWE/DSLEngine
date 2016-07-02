/*
* Name : ShowModel.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.0          2014-03-01     Gianluca Donato
* -------------------------------------------------
* Codifica modulo
* =================================================
*/

"use strict";

var AttributeReader = require("../utils/AttributeReader");
var Row = require("./Row");
var MaapError = require("../utils/MaapError");
var RequiredParamException = require("../utils/requiredParamException");
var UnexpectedParamException = require("../utils/unexpectedParamException");
var ObjectUtils = require("./ObjectUtils");

var ShowModel = function(params, parent) {
    var self = this;
    
    this.attributes = [];
    this.parent = parent;
    this.parent.setShowModel(this);
    this.model = this.parent.model;

    // Leggi i parametri obbligatori e opzionali
    AttributeReader.readRequiredAttributes(params, this, [], (param) => {
	throw new RequiredParamException(this, param);
    });

    AttributeReader.readOptionalAttributes(params, this, ["populate"]);
    AttributeReader.assertEmptyAttributes(params, (param) => { 
	throw new UnexpectedParamException(this, param);
    });

    this.noMoreRows();
};

ShowModel.prototype.addRow = function(attribute) {
	this.attributes.push(attribute);
};

ShowModel.prototype.getRows = function() {
	return this.attributes;
};

// Chiamato al termine di tutti gli addRow del DSL
ShowModel.prototype.noMoreRows = function() {
	// se servisse ...
};

// Se non ci sono attributi in attributes prende tutti i campi di document
ShowModel.prototype.getRowsForDocument = function(document) {
    if (this.attributes.length > 0) {
	   return this.attributes;
    } else {
        var result = [];
        var attributes = ObjectUtils.getAttributes(document);

        for (var j=0; j<attributes.length; j++) {
            var attr = attributes[j];

            result.push(
                new Row(this, {name: attr})
            );
        }

        return result;
    }
};

var formatDocument = function(document, attributes) {
    var jsonResult = [];

    attributes.forEach(function(attribute) {
        var name = attribute.getName();
        var raw = ObjectUtils.getByDotPath(document, name);
        var transformed = attribute.getTransformation()(raw);

        var jsonElement = {
            label: attribute.getLabel(),
            name: name,
            raw: raw,
            data: transformed
        };

        jsonResult.push(jsonElement);
    });

    return jsonResult;
};

ShowModel.prototype.getData = function(documentId, callback, errback) {
    var self = this;
    
    self.model.findByIdAndPopulate(
        documentId,
        self.populate,
        function success(result) {
            callback(formatDocument(
                result.toObject(),
                self.getRowsForDocument(result.toObject())
            ));
        },
        errback
    );
};

ShowModel.prototype.deleteDocument = function(documentId, callback, errback) {
    this.model.safeFindByIdAndRemove(
        documentId,
        callback,
        errback
    );
};

ShowModel.prototype.updateDocument = function(
    documentId,
    documentUpdated, 
    callback, 
    errback
) {
    this.model.safeFindById(
        documentId,
        function success(result) {
            result.upsert(
                documentUpdated,
                function(res) {
                    callback(formatDocument(
                        result.toObject(),
                        self.getRowsForDocument(result.toObject())
                    ));
                },
                errback
            );
        },
        errback
    );
};

ShowModel.prototype.toString = function () {
    return `Show of ${this.parent.toString()}`;  
};

module.exports = ShowModel;

