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

    describe("#loadCollectionWithoutLabel", () => {
	it("should throw the NoLabelException", (done) => {
	    var dsl = `collection() {}`;
	    
	    engine.loadDSL(dsl)
	    .catch((err) => {
		chai.expect(err).to.be.instanceof(NoLabelException);
		done();
	    });
	});
    });
    
    describe("#loadSingleCollectionEmpty", () => {
        it("should load the collection without errors", (done) => {
            var dsl = `collection (
		name: "pluto",
		label: "1",
		weight: 0
	    ) {}`;

            engine.loadDSL(dsl)
	    .then(() => {
		return done();
	    }).catch((err) => {
		return done(errs);
	    });
	});
    });

    describe("#loadCollectionWithIndex", () => {
	it("should load the collection without errors", (done) => {
	    var dsl = `collection (
		name: "pippo",
		label: "2"
	    ) {
		index (
		    query: {},
		) {}
	    }`;

	    engine.loadDSL(dsl)
	    .then(() => {
		return done();
	    }).catch((err) => {
		return done(err);
	    });
	});
    });

    // TODO
    describe("#loadCollectionWitShow", () => {
	it("should load the collection without errors", (done) => {
	    var dsl = `collection (
		name: "pippo",
		label: "3"
	    ) {
		show () {}
	    }`;

	    engine.loadDSL(dsl)
	    .then(() => {
		return done();
	    }).catch((err) => {
		return done(err);
	    });
	});
    });

    describe("#loadCollectionWithIndexColumn", () => {
	it("should load the collection without errors", (done) => {
	    var dsl = `collection (
		name: "pippo",
		label: "4"
	    ) {
		index() {
		    column (
			name: "Ecco",
			prova: 3
		    )
		}
	    }`;

	    engine.loadDSL(dsl)
	    .then(() => {
		return done();
	    }).catch((err) => {
		return done(err);
	    });
	});
    });
});
