/*
* Name : IndexModel.js
* Module : Back-end::Lib::Model::DSLModel
* Location : /lib/model/dslmodel/
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.1          2014-03-04      Federico Poli
* -------------------------------------------------
* Codifica modulo
* =================================================
*/

"use strict";

var AttributeReader = require("../utils/AttributeReader");
var Column = require("./Column");
var RequiredParamException = require("../utils/requiredParamException");
var UnexpectedParamException = require("../utils/unexpectedParamException");
var ObjectUtils = require("./ObjectUtils");

var IndexModel = function(params, parent) {
    var self = this;
    this.parent = parent;
    this.parent.setIndexModel(this);
    
    this.model = parent.model;
    this.docModel = undefined;
    this.attributes = [];

    // Valori di default
    // TODO è hardcoded, meglio andare a prenderlo da config
    // attraverso this.collectionModel.dslDomain.config
    // e facendo passare config come parametro a DslModel
    this.perpage = 50;
    this.sortby = "_id";
    this.order = "asc";
    this.query = {};

    // Leggi i parametri obbligatori
    AttributeReader.readRequiredAttributes(params, this, [], (param) => {
	throw new RequiredParamException(this, param);
    });

    // Leggi i parametri opzionali
    AttributeReader.readOptionalAttributes(params, this, ["perpage", "sortby", "order", "query", "populate"]);

    // Verifica che i parametri non siano vuoti
    AttributeReader.assertEmptyAttributes(params, (param) => {
	throw new UnexpectedParamException(this, param);
    });

    // Valori di default
    if (this.query === undefined) {
	   this.query = {};
    }

    // Verifico che query sia un oggetto
    if (typeof this.query !== 'object') {
	throw new UnexpectedParamException(this, 'query');
    }

    this.noMoreColumns();
};

IndexModel.prototype.addColumn = function(attribute) {
	this.attributes.push(attribute);
};

IndexModel.prototype.getColumns = function() {
	return this.attributes;
};

// Chiamato al termine di tutti gli addColumn del DSL
IndexModel.prototype.noMoreColumns = function() {
	this.setDefaultColumnSelectable();
	// this.validateSortBy();
};

IndexModel.prototype.setDefaultColumnSelectable = function() {
	var self = this;
	var present = false;

	for (var i=0; i<self.attributes.length && !present; i++) {
		if (self.attributes[i].isSelectable()) {
			present = true;
		}
	}
	if (present === false) {
		var idPresent = false;
		for (i=0; i<self.attributes.length && !idPresent; i++) {
			if (self.attributes[i].getName() === "_id") {
				self.attributes[i].setSelectable(true);
				idPresent = true;
			}
		}
		if (!idPresent && self.attributes.length > 0) {
			self.attributes[0].setSelectable(true);
		}
	}
};

// Se non ci sono attributi in attributes prende tutti i campi di document
IndexModel.prototype.getColumnsForDocuments = function(documents) {
    if (this.attributes.length > 0) {
	   return this.attributes;
    } else {
        var exists = {};
        var result = [];

        for (var i=0; i<documents.length; i++) {
            var document = documents[i];
            var attributes = ObjectUtils.getAttributes(document);

            for (var j=0; j<attributes.length; j++) {
                var attr = attributes[j];

                if (!exists[attr]) {
                    exists[attr] = true;
                    result.push(
                        new Column(this, {
                            name: attr,
                            selectable: attr === "_id"
                        })
                    );
                }
            }
        }

        return result;
    }
};

var formatHeader = function(attributes) {
    var jsonResult = [];

    attributes.forEach(function(attribute) {
        var jsonElement = {
            label: attribute.getLabel(),
            name: attribute.getName(),
            selectable: attribute.isSelectable(),
            sortable: attribute.isSortable()
        };

        jsonResult.push(jsonElement);
    });

    return jsonResult;
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
            data: transformed,
            selectable: attribute.isSelectable(),
            sortable: attribute.isSortable()
        };

        jsonResult.push(jsonElement);
    });

    return jsonResult;
};

IndexModel.prototype.getData = function(page, sortBy, order, callback, errback) {
    var self = this;

    if (!page) {
	   page = 1;
    }

    var query = self.model.findAllPaginatedQuery(self.query, self.perpage, page);

    if (!sortBy) {
	   sortBy = self.sortby;
    }
    if (!order) {
	   order = self.order;
    }
    if (order === "desc") {
	   query.sort("-" + sortBy);
    } else {
	   query.sort(sortBy);
    }

    if (self.populate) {
        if (self.populate instanceof Array) {
            for (var i=0; i<self.populate.length; i++) {
            query.populate(self.populate[i]);
            }
        }
        else {
            query.populate(self.populate);
        } 
    }
    
    query.exec(function(err, _docs) {
        if (err) {
            errback(err);
        }  
        else {
            var docs = _docs.map(function(x){
              return x.toObject();
            });
            var attributes = self.getColumnsForDocuments(docs);

            var jsonResult = {
                id: self.parent.getId(),
                name: self.parent.getName(),
                label: self.parent.getLabel(),
                numdocs: 0,
                perpage: self.perpage,
                header: formatHeader(attributes),
                documents: []
            };

            for (var i=0; i<docs.length; i++) {
                var document = docs[i];

                var docJson = {
                    id: document._id,
                    data: formatDocument(document, attributes)
                };

                jsonResult.documents.push(docJson);
            }

            self.model.count(self.query, function(err, count) {
                if (err) {
                    errback(err);
                } else {
                    jsonResult.numdocs = count;
                    callback(jsonResult);
                }
            });
        }	
    });
};

IndexModel.prototype.toString = function () {
    return `Index of ${this.parent.toString()}`;
};

module.exports = IndexModel;
