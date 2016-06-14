var mongoose = require("mongoose");
var chai = require("chai");
chai.use(require("chai-as-promised"));

var DSLEngine = require("../src/dslEngine");
var TokenAlreadyInsertException = require(
    "../src/utils/tokenAlreadyInsertException"
);

describe("Token", () => {
    var engine;
    var token;
    var connection;

    before(() => {
	   console.log(process.env.npm_package_config_CONNECTION);
	   engine = new DSLEngine();
    });

    describe("#createAToken", () => {
	   it("should return a not undefined token", () => {
            token = engine.generateToken(mongoose.createConnection(null));
	       chai.expect(token).to.not.undefined;
	   });
    });

    describe("#insertToken", () => {
	   it("shoud not throw any exception when push a token", () => {
	       chai.expect(
                engine.pushToken.bind(engine, token)
	       ).to.not.throw();
	   });
    });

    describe("#insertTokenOneOtherTime", () => {
	   it("should throw exception TokenAlreadyInsertException", () => {
	       chai.expect(engine.pushToken.bind(engine, token)).to.throw(
		      TokenAlreadyInsertException
	       );
	   });
    });

    
});

