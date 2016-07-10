var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var MaapError = require("../utils/MaapError");
var NoLabelException = require("../utils/noLabelException");
var UnexpectedException = require("../utils/unexpectedParamException");

var DashboardModel = function(params) {
    this.rows = [];

    AttributeReader.readRequiredAttributes(
        params,
        this,
        ["label"],
        function (param) {
	    throw new NoLabelException("dashboard");
        }
    );
    
    AttributeReader.readOptionalAttributes(params,this,[]);
    
    // Verifica che i parametri non siano vuoti
    AttributeReader.assertEmptyAttributes(
        params, 
        function (param) {
	    throw new UnexpectedException(this, param);
        }
    );
    
    this.id = hash(new Date().getMilliseconds());
}

DashboardModel.prototype.getId = function () {
    return this.id;
};

DashboardModel.prototype.getLabel = function () {
    return this.label;  
};

DashboardModel.prototype.getReferenceMatrix = function () {
    return this.rows;
};

DashboardModel.prototype.setReferenceMatrix = function (matrix) {
    this.rows = matrix;
}

DashboardModel.prototype.push = function (column) {
    this.rows.push(column);
};

DashboardModel.prototype.toString = function () {
    return `Dashboard ${this.label}`;
};

module.exports = DashboardModel;
