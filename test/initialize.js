var DSLEngine = require("../src/dslEngine.js");
var mongoose = require("mongoose");
var chai = require("chai");
chai.use(require("chai-as-promised"));

describe("Token", () => {
    var engine;
    var connection;

    before(() => {
	engine = new DSLEngine();
	connection = mongoose.createConnection(null);
    });

    describe("#createAToken", () => {
	it("should return a not undefined token", () => {
	    var token = engine.generateToken(connection);
	    chai.expect(token).to.not.undefined;
	});
    });
});

