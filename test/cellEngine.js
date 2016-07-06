require("./collectionEngine");

const fs = require("fs");
var mongoose = require("mongoose");
var chai = require("chai");
chai.use(require("chai-as-promised"));

var engine = require("../src/dslEngine");
var TokenAlreadyInsertException = require(
    "../src/utils/tokenAlreadyInsertException"
);
var NoTokenConnectedException = require(
    "../src/utils/noTokenConnectedException"
);
var NoNameException = require("../src/utils/noNameException");
var NoLabelException = require("../src/utils/noLabelException");
var WrongTypeException = require("../src/utils/wrongTypeException");

describe("CellEngine", () => {
    var cellEngine;
    var token;

    before((done) => {
	var connection = mongoose.createConnection(
	    `mongodb://${process.env.npm_package_config_CONNECTION}/prova`
	);

	token = engine.generateToken(connection);

	engine.pushToken(token);
	cellEngine = engine.cell();

	var load = engine.loadDSL(`cell (
	    label: "cell",
	    type: "date",
	    value: {
		collection: "tests"
	    }
	)`);

	load.then(() => {
	    done()
	}).catch((err) => {
	    done(err);
	});
    });

    after(() => {
	engine.ejectSafelyToken();
    });

    describe("#getValue", () => {
	it("should return the data", (done) => {
	    var list = cellEngine.list();
	    var id = list[0].id;

	    var promise = cellEngine.getValue(id);
	    promise.then((data) => {
		done();
	    }).catch((err) => {
		done(err);
	    });
	});
    });
});

