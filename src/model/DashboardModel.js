var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var MaapError = require("../utils/MaapError");

var DashboardModel = function(params) {
    this.rows = [];
    
    AttributeReader.readRequiredAttributes(
        params,
        this,
        ["label"],
        function (param) {
            throw new MaapError(
                8000,
                `Required parameter \'${param}\' in \'${this.toString()}\'`
            );
        }
    );
    
    AttributeReader.readOptionalAttributes(param,this,[]);
    
    // Verifica che i parametri non siano vuoti
    AttributeReader.assertEmptyAttributes(
        params, 
        function (param) {
            throw new MaapError(
                14000, 
                `Unexpected parameter \'${param}\' in \'${this.toString()}\'`
            );
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
