require("./token.js");

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
            /*`mongodb://${process.env.npm_package_config_CONNECTION}/prova`*/
        ));
        
        engine.pushToken(token);
    });
    
    describe("#prova", () => {
        it("ok", () => {
            
        });
    });
});
