var DashboardModel = require("../model/DashboardModel");
var AttributeReader = require("../utils/AttributeReader");

/**
 */
var DashboardEngine = function (node) {
    this.registry = {};
    this.node = node;
    
    this.node.onLoad(register.bind(this));
}

DashboardEngine.prototype.getDashboard = function (id) {
    var dashboard = this.registry[id];
    
    return new Promise((resolve, reject) => {
        if (dashboard == undefined) {
            reject(new MaapError(18000));
        } else {
            resolve(dashboard.getReferenceMatrix());
        }
    });
};

function replaceWithId(matrix) {
    matrix.forEach((column) => {
        column.forEach((reference) => {
            if (reference.type === "cell") {
                this.token.emit(
                    "getIdCellByLabel",
                    reference.label,
                    (err, id) => {
                        if (err) {
                            throw err;
                        } else {
                            reference.id = id;
                            delete reference.label;
                        }
                    }
                )
            } else if (reference.type === "collection") {
                this.token.emit(
                    "getIdCollectionByLabel",
                    reference.label,
                    (err, id) => {
                        if (err) {
                            throw err;
                        } else {
                            reference.id = id;
                            delete reference.label;
                        }
                    }
                )
            } else if (reference.type === "document") {
                this.token.emit(
                    "getIdDocumentByLabel",
                    reference.label,
                    (err, id) => {
                        if (err) {
                            throw err;
                        } else {
                            reference.id = id;
                            delete reference.label;
                        }
                    }
                )
            }
        }); 
    });
}

/**
 * @description
 * Registrer the dashboard into the engine. When the dashboard has been 
 * loaded, the engine replace any label with the model's id reference by
 * label.
 * @param models {Model[]}
 * Models loaded
 */
function register(models) {
    models.forEach((model) => {
        if (model instanceof DashboardModel) {
            try {
                this.replaceWithId(model.getReferenceMatrix());
                this.registry[model.getId()] = model;
                
                this.token.emitReply();
            } catch (err) {
                this.token.emitReply({
                    err: err
                });
            }
        }
    });
}

module.exports = DashboardEngine;
