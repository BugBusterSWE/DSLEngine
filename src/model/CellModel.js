var hash = require("object-hash");
var AttributeReader = require("../utils/AttributeReader");
var DocumentSchema = require("./DocumentSchema");
var NoLabelException = require("../utils/noLabelException");
var RequiredParamException = require("../utils/requiredParamException");
var UnexpectedParamException = require("../utils/unexpectedParamException");
var WrongTypeException = require("../utils/wrongTypeException");

var CellModel = function (params, connection) {
    this.source = {};
    this.value = "";
    
    AttributeReader.readRequiredAttributes(
        params, 
        this, 
        ["type", "label", "value"],
        (param) => {
	    if (param === "label") {
		throw new NoLabelException("cell");
	    } else {
		throw new RequiredParamException(this, param);
	    }
        }
    );

    AttributeReader.readOptionalAttributes(params,this,[]);
    
    // Verifica che i parametri non siano vuoti
    AttributeReader.assertEmptyAttributes(
        params, 
        (param) => {
	    throw new UnexpectedParamException(this, param);
        }
    );
    
    if (!(
        typeof this.value === "string" || 
        typeof this.value === "number" || 
        typeof this.value === "object"
    )) {
        throw new WrongTypeException(this);
    }

    if (typeof this.value === "object") {
	this.sortby = "_id";
	this.order = "asc";

        AttributeReader.readRequiredAttributes(
            this.value,
            this,
            ["collection"]
        )

	AttributeReader.readOptionalAttributes(
	    this.value,
	    this,
	    ["sortby", "order", "query"]
	);

	AttributeReader.assertEmptyAttributes(
	    this.value,
	    (param) => {
		throw new UnexpectedParamException(this, param);
	    }
	);

	this.model = connection.model(this.collection, DocumentSchema);
	delete this.value;
    }

    this.id = hash(new Date().getMilliseconds());
}

CellModel.prototype.getId = function () {
    return this.id;
};

CellModel.prototype.getLabel = function () {
    return this.label;
};

CellModel.prototype.getType = function () {
    return this.type;
};

CellModel.prototype.getData = function (callback) {
    var jsonResult = {
        id: this.getId(),
        label: this.getLabel(),
        type: this.type,
        result: {}
    };
    
    if (typeof this.value === "string" || typeof this.value === "number" ) {
        jsonResult.result = this.value;
        callback(undefined, jsonResult);
    } else {
        var query = this.model.findAllPaginatedQuery(this.query, 1);
        
        if (this.order === "desc") {
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

