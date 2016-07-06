var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var ShowModel = require("./ShowModel");
var MaapError = require("../utils/MaapError");
var RequiredParamException = require("../utils/requiredParamException");
var NoLabelException = require("../utils/noLabelException");
var UnexpectedParamException = require("../utils/unexpectedParamException");

var DocumentModel = function (params, connection) {
    this.showModel = new ShowModel({}, this);

    // Leggi i parametri obbligatori e opzionali
    AttributeReader.readRequiredAttributes(
        params, 
        this, 
        ["name", "label"], 
        (param) => {
	    if (param === "label") {
		throw new NoLabelException("document");
	    } else {
		throw new RequiredParamException(this, param);
	    }
	}
    );
    
    AttributeReader.readOptionalAttributes(params, this, [""]);
    AttributeReader.assertEmptyAttributes(params, (param) => {
	throw new UnexpectedParamException(this, param);
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

DocumentModel.prototype.addRow = function (attribute) {
    this.showModel.addRow(attribute);
};

module.exports = DocumentModel;
