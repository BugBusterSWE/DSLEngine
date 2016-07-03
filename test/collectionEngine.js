require("./loadDsl.js");

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
var WrongTypeException = require("../src/utils/wrongTypeException");

var Schema = require("../src/model/DocumentSchema.js");

describe("collectionEngine", () => {
    var engine;
    var collectionEngine;
    var token;
    
    before((done) => {
        engine = new DSLEngine();

        var connection = mongoose.createConnection(
            `mongodb://${process.env.npm_package_config_CONNECTION}/prova`
        )

	mongoose.connect(`mongodb://${process.env.npm_package_config_CONNECTION}/prova`);

	var Model = mongoose.model('test', { user: String, pass: String });
	Model.find((err, data) => {
	    console.log(err || data);
	});

	token = engine.generateToken(connection);

        engine.pushToken(token);
	collectionEngine = engine.collection();

	var load = engine.loadDSL(`collection(
	    name: "test",
	    label: "test"
	) {
	    index() {
		column(
		    name: "user",
		    transformation: function (val) {
			return val.toUpperCase();
		    }
		)

		column(
		    name: "pass",
		    label: "Password",
		    sortable: true
		)
	    }
	}`);

	load.then(() => {
	    done();
	}).catch((err) => {
	    done(err);
	});
    });

    describe("#list", () => {
	it("shoud return all collection stored into the engine", () => {
	    chai.expect(collectionEngine.list().length).to.equal(1);
	});
    });

    describe("#getIndexPage", () => {
	it("should get the structure of the index page", (done) => {
	    var list = collectionEngine.list();
	    var id = list[0].id;

	    var promise = collectionEngine.getIndexPage(id);
	    promise.then((data) => {
		console.log(data);
		done();
	    }).catch((err) => {
		console.log(err);
		done(err);
	    });
	});
    });
});

