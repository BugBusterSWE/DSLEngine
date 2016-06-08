var DashboardModel = require("../model/DashboardModel");
var AttributeReader = require("../utils/AttributeReader");

/**
 */
var DashboardEngine = function (node) {
    this.registry = {};
    this.node = node;
    
    this.register = register;
    this.replaceLabelWithId = replaceLabelWithId;
    
    this.node.onLoad(this.register);
}

DashboardEngine.prototype.getDashboard = function (id) {
    var dashboard = this.registry[id];
    
    return new Promise((resolve, reject) => {
        if (dashboard == undefined) {
            reject(new MaapError(18000));
        } else {
            resolve({
                id: id,
                label: dashboard.getLabel();
                content: dashboard.getReferenceMatrix()
            });
        }
    });
};

function replaceLabelWithId(reference) {
    var idAndType = {
        type: reference.type,
        id: String 
    };
        
    return new Promise((resolve, reject) => {
        var getId = (err, id) => {
            if (err) {
                reject(err);
            } else {
                idAndType.id = id;
                resolve(idAndType);
            }
        };
        
        if (reference.type === "cell") {
            this.token.emit("getIdCellByLabel", reference.label, getId);
        } else if (reference.type === "collection") {
            this.token.emit("getIdCollectionByLabel", reference.label, getId);
        } else if (reference.type === "document") {
            this.token.emit("getIdDocumentByLabel", reference.label, getId);
        }
    });
};

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
            var matrix = model.getReferenceMatrix();
            var promiseMatrix = [];
            var validMatrix = [];
            var errors = [];
            var ready = Promise.resolve(null);
            
            matrix.forEach((vector) => {
                promiseMatrix.push(vector.map(this.replaceLabelWithId));    
            });

            promiseMatrix.forEach((promiseVector) => {
                var coll = [];
                validMatrix.push(coll);
                
                promiseVector.forEach((promise) => {
                    ready = ready.then(()=>{
                        return promise
                    }).then((val) => {
                        coll.push(val);    
                    }).catch((err) => {
                        errors.push(err);
                    });
                }) 
            });
            
            ready.then(() => {
                if (errors.length > 0) {
                    this.node.emitReply(errors);
                } else {
                    model.setReferenceMatrix(validMatrix);
                    
                    this.registry[model.getId()] = model;
                    this.node.emitReply();
                }
            });
        }
    });
}

module.exports = DashboardEngine;
