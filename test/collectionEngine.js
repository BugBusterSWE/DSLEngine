require("./loadDsl.js");

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

describe("collectionEngine", () => {
    var collectionEngine;
    var token;
    
    before((done) => {

        var connection = mongoose.createConnection(
	    `mongodb://${process.env.npm_package_config_CONNECTION}/prova`
        );

	token = engine.generateToken(connection);

        engine.pushToken(token);
	collectionEngine = engine.collection();

	var load = engine.loadDSL(`collection(
	    name: "tests",
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

	    show() {
		row(
		    name: "user"
		)
		row(
		    name: "pass",
		    transformation: function (val) {
			return val + " 1";
		    }
		)
	    }
	}`);

	load.then(() => {
	    done();
	}).catch((err) => {
	    done(err);
	});
    });

    after(() => {
	engine.ejectSafelyToken();
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
		done();
	    }).catch((err) => {
		done(err);
	    });
	});
    });

    describe("#getShowPage", () => {
	it("should get the structure of the show page", (done) => {
	    var list = collectionEngine.list();
	    var id = list[0].id;
	    
	    var promise = collectionEngine.getShowPage(
		id, 
		"577902e2dcba0f46c490afa2"
	    );
	    promise.then((data) => {
		done();
	    }).catch((err) => {
		done(err);
	    });
	});
    });
});

