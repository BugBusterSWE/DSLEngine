var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var MaapError = require("../utils/MaapError");

var CellModel = function (params, connection) {
    this.collection = undefined;
    this.source = undefined;

    AttributeReader.readRequiredAttributes(
	params, 
	this, 
	["type", "label"],
	function (param) {
	    throw new MaapError(
		8000,
		`Required parameter '${param}' in cell '${self.toString()}'`
	    );
	}
    );
    
    if (this.queryOn !== undefined) {
	this.collection = this.queryOn;
    }

    this.model = connection.model(this.collection, DocumentSchema);
    this.id = hash(new Date().getMilliseconds());
}

CellModel.prototype.getId = function () {
    return this.id;
};

CellModel.prototype.getLabel = function () {
    return this.label;
};

CellModel.prototype.set = function (source) {
    this.source = source;
};

CellModel.prototype.getData = function () {
    if (this.collection === undefined)
    // Run all content inside the branckets
    var query = this.model.findAll(this.source);
};

CellModel.prototype.toString = function () {
    return `Cell ${this.label}`;
};

module.exports = CellModel;

