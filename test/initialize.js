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
	var token = engine.generateToken(connection);
	chai.expect(token).to.not.undefined;
    });
});

