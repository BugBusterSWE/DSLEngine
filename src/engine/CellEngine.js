var CellModel = require("../model/CellModel");
var AttributeReader = require("../utils/AttributeReader");

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
    var c = this.registry.find((cell) => {
        return cell.getIdByLabel() === label;
    });
    
    if (c == undefined) {
        callback(new MaapError(18000));
    } else {
        callback(undefined, coll.getId());
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
