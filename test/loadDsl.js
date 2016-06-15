require("./token.js");

const fs = require("fs");
var mongoose = require("mongoose");
var chai = require("chai");
chai.use(require("chai-as-promised"));

var DSLEngine = require("../src/dslEngine");
var TokenAlreadyInsertException = require(
    "../src/utils/tokenAlreadyInsertException"
);
var NoTokenConnectedException = require(
    "../src/utils/noTokenConnectedException"
);
var NoNameException = require("../src/utils/noNameException");
var NoLabelException = require("../src/utils/noLabelException");

describe("LoadDSL", () => {
    var engine;
    var token;
    
    before(() => {
        engine = new DSLEngine();
        token = engine.generateToken(mongoose.createConnection(
            `mongodb://${process.env.npm_package_config_CONNECTION}/prova`
        ));
        
        engine.pushToken(token);
    });
    
    describe("#loadSingleCollectionEmpty", () => {
        it("should load the collection without errors", () => {
            var dsl = `collection (
		label: "Per_te"
	    ) {}`;

            var promise = engine.loadDSL(dsl);
            
            return promise.then(() => {
                console.log("Fatto");
            }).catch((err) => {
		if (err instanceof NoNameException) {
		    console.log("Etichetta nome mancante");
		} else if (err instanceof NoLabelException) {
		    console.log("Etichetta label mancante");
		}
            })
            
        });
    });
});
