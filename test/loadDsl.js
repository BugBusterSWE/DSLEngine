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

describe("LoadDSL", () => {
    var engine;
    var token;
    
    before(() => {
        engine = new DSLEngine();
        token = engine.generateToken(mongoose.createConnection(
            null
            /*`mongodb://${process.env.npm_package_config_CONNECTION}/prova`*/
        ));
        
        engine.pushToken(token);
    });
    
    describe("#loadSingleCollectionEmpy", () => {
        it("should load the collection without errors", () => {
            var dsl = `collection () {}`;

            var promise = engine.loadDSL(dsl);
            
            promise.then(() => {
                console.log("Fatto");
            }).catch((err) => {
                console.log(err);
            })
            
        });
    });
});
