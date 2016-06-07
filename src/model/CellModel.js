var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var MaapError = require("../utils/MaapError");

var CellModel = function (params, connection) {
    this.source = {};
    this.value = "";
    
    AttributeReader.readRequiredAttributes(
        params, 
        this, 
        ["type", "label", "value"],
        function (param) {
            throw new MaapError(
            8000,
            `Required parameter '${param}' in cell '${self.toString()}'`
            );
        }
    );

    AttributeReader.readOptionalAttributes(param,this,[]);
    
    // Verifica che i parametri non siano vuoti
    AttributeReader.assertEmptyAttributes(
        params, 
        function(param) {
            throw new MaapError(
                14000, 
                `Unexpected parameter \'${param}\' in index of ` +  
                `\'${self.parent.toString()}\'`
            );
        }
    );
    
    if (!(
        this.value instanceof String || 
        this.value instanceof Number || 
        this.value instanceof Object
    )) {
        throw new CellUnknowTypeValue(this);
    }
    
    if (this.value instanceof Object) {
        AttributeReader.readRequiredAttributes(
            this.value,
            this,
            ["collection", "query"]
        )
    }
    
    this.model = connection.model(this.collection, DocumentSchema);
    this.id = hash(new Date().getMilliseconds());
}

CellModel.prototype.getId = function () {
    return this.id;
};

CellModel.prototype.set = function (source) {
    this.source = source;
};

CellModel.prototype.getData = function (callback) {
    var jsonResult = {
        id: this.getId(),
        label: this.getLabel(),
        type: this.type,
        result: {}
    };
    
    if (this.value instanceof String || this.value instanceof Number) {
        jsonResult.result = this.source;
        callback(undefined, jsonResult);
    } else {
        var query = this.model.findAllPaginatedQuery(this.source, 1);
        
        if (order === "desc") {
	       query.sort(`-${this.sortby}`);
        } else {
	       query.sort(this.sortby);
        }
        
        query.exec((err, _docs) => {
            if (err) {
                callback(err);
            } else {
                var docs = _docs.map((x) => {
                    return x.toObject();
                });
                
                // Get the only once value
                jsonResult.result = docs[0];
                
                callback(undefined, jsonResult);
            }
        });
    }
};

CellModel.prototype.toString = function () {
    return `Cell ${this.label}`;
};

module.exports = CellModel;

