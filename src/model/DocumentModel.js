var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var ShowModel = require("./ShowModel");
var MaapError = require("../utils/MaapError");

var DocumentModel = function (param, connection) {
    this.showModel = new ShowModel({}, this);

    // Leggi i parametri obbligatori e opzionali
    AttributeReader.readRequiredAttributes(
        params, 
        this, 
        ["name", "label"], 
        function (param) {
            throw new MaapError(
                8000, 
                `Required parameter '${param}' in Document `+
                `'${self.toString()}'`
            );
        }
    );
    
    AttributeReader.readOptionalAttributes(params, this, [""]);
    AttributeReader.assertEmptyAttributes(params, function (param) {
	   throw new MaapError(
           8000, 
           `Unexpected parameter '${param}' in collection '${self.toString()}'`
       );
    });
    
    this.model = connection.model(this.name, DocumentSchema);
    this.id = hash(new Date().getMilliseconds());
}

DocumentModel.prototype.getId = function () {
    return this.id;
};

DocumentModel.prototype.getLabel = function() {
	return this.label;
};

DocumentModel.prototype.getShowModel = function () {
    return this.showModel;
};

DocumentModel.prototype.setShowModel = function(showModel) {
	this.showModel = showModel;
};

DocumentModel.prototype.toString = function () {
    return `Document ${this.getLabel()}`;
};

module.exports = DocumentModel;
