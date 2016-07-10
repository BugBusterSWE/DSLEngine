var CellModel = require("../model/CellModel");
var AttributeReader = require("../utils/AttributeReader");
var ModelNotFoundException = require("../utils/modelNotFoundException");

var _LABEL = "cell";

/**
 */
var CellEngine = function (node) {
    this.registry = {};
    this.node = node;

    this.getCellModel = getCellModel.bind(this);

    this.node.onLoad(register.bind(this));
    this.node.onEjectToken(saveEnvironment.bind(this));
    this.node.onPushToken(loadEnvironment.bind(this));
    this.node.on("getIdCellByLabel", getIdByLabel.bind(this));
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
	    reject(new ModelNotFoundException('cell', id));
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

CellEngine.prototype.list = function () {
    var models = this.getCellModel();
    var cells = [];

    for (var i = 0; i < models.length; i++) {
	cells.push({
	    id: models[i].getId(),
	    label: models[i].getLabel()
	});
    }

    return cells;
};

function getCellModel() {
    var models = [];

    for (var id in this.registry) {
	if (this.registry.hasOwnProperty(id)) {
	    models.push(this.registry[id]);
	}
    }

    return models;
}

function getIdByLabel(label, callback) {
    var id = undefined;

    for (cell in this.registry) {
	if (this.registry[cell].getLabel() === label) {
	    id = cell;
	    break;
	}
    }

    if (id == undefined) {
        callback(new ModelNotFoundException('cell', label));
    } else {
        callback(undefined, id);
    }
}

function loadEnvironment(token) {
    var loadModules = token.load(_LABEL);
    this.registry = loadModules || {};
}

function register(models) {
    models.forEach((model) => {
        if (model instanceof CellModel) {
            this.registry[model.getId()] = model;
            this.node.emitReply();
        }
    });
}

function saveEnvironment(token) {
    token.save(_LABEL, this.registry);
}

module.exports = CellEngine;

