var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var MaapError = require("../utils/MaapError");

var DashRowModel = function () {
    this.column = [];
};

DashRowModel.prototype.registerCell = function (cellReference) {
    this.column.push({
        type: "cell",
        label: cellReference
    });
};

DashRowModel.prototype.registerCollection = function (collectionReference) {
    this.column.push({
        type: "collection",
        label: collectionReference
    });
};

DashRowModel.prototype.registerDocument = function (documentReference) {
    this.column.push({
        type: "document",
        label: documentReference
    });   
};

DashRowModel.prototype.swap = function (dashboard) {
    dashboard.push(this.column);
};

module.exports = DashRowModel;
