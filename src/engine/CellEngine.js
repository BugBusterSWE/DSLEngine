var CellModel = require("../model/CellModel");

/**
 */
var CellEngine = function (node) {
    this.registry = {};
    this.node = node;

    this.node.onLoad(register.bind(this));
};

/**
 * @description
 * Get the value store in the cell
 * @param id {string}
 * The id of the Cell
 * @return {Promise}
 * The promise is resolved with the cell's value or is reject with the error 
 * occurred
 */
CellEngine.prototype.getValue = function (id) {
    var cell = this.registry[id];

    return new Promise((resolve, reject) => {
	if (cell === undefined) {
	    reject(new MaapError(7000));
	} else {
	    cell.getData((err, data) => {
		if (err) {
		    reject(err);
		} else {
		    resolve(data);
		}
	    });
	}
    });
};


function register(models) {
    models.forEach((model) => {
	if (model instanceof CellModel) {
	    this.registry[model.getId()] = model;
	    this.node.emitReply();
	}
    });
}

module.exports = CellEngine;

