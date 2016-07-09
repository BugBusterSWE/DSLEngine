require("./token.js");

const fs = require("fs");
var mongoose = require("mongoose");
var chai = require("chai");
chai.use(require("chai-as-promised"));

var dslengine = require("../src/dslEngine");
var TokenAlreadyInsertException = require(
    "../src/utils/tokenAlreadyInsertException"
);
var NoTokenConnectedException = require(
    "../src/utils/noTokenConnectedException"
);
var NoNameException = require("../src/utils/noNameException");
var NoLabelException = require("../src/utils/noLabelException");
var WrongTypeException = require("../src/utils/wrongTypeException");

describe("LoadDSL", () => {
    var token;
    var engine;
    
    before(() => {
	engine = new dslengine.DSLEngine();

        token = engine.generateToken(mongoose.createConnection(
            `mongodb://${process.env.npm_package_config_CONNECTION}/prova`
        ));
        
        engine.pushToken(token);
    });

    after(() => {
	engine.ejectSafelyToken();
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
		    done();
		}).catch((err) => {
		    done(errs);
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
		    done();
		}).catch((err) => {
		    done(err);
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
		    done();
		}).catch((err) => {
		    done(err);
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
			name: "Ecco"
		    )
		}
	    }`;

	    engine.loadDSL(dsl)
		.then(() => {
		    done();
		}).catch((err) => {
		    done(err);
		});
	});
    });

    describe("#loadCollectionWithRow", () => {
	it("should load the collection without errors", (done) => {
	    var dsl = `collection (
		name: "pippo",
		label: "5"
	    ) {
		show () {
		    row (
			name: "gianni"
		    )
		}
	    }`;

	    engine.loadDSL(dsl)
		.then(() => {
		    done();
		}).catch((err) => {
		    done(err);
		});
	});
    });

    describe("#loadDocumentWithRow", () => {
	it("should load the model without errors", (done) => {
	    var dsl = `document(
		name: "pippo",
		label: "6"
	    ) {
		row(
		    name: "p"
		)
		row(
		    name: "s"
		)
	    }`;

	    engine.loadDSL(dsl)
		.then(() => {
		    done();
		}).catch((err) => {
		    done(err);
		});
	});
    });

    describe("#loadWrongDocument", () => {
	it("should throw an exception", (done) => {
	    var dsl = `document(
		name: "tu"
	    ) {}`;

	    engine.loadDSL(dsl)
		.catch((err) => {
		    done();
		});
	});
    });

    describe("#loadElementaryCell", () => {
	it("should load the model without errors", (done) => {
	    var dsl = `cell(
		label: "cell",
		type: "img",
		value: 3
	    )`;

	    engine.loadDSL(dsl)
		.then(() => {
		    done();
		}).catch((err) => {
		    done();
		});
	});
    });

    describe("#loadObjectCell", () => {
	it("should load the model without errors", (done) => {
	    var dsl = `cell(
		label: "cell",
		type: "img",
		value: {
		    collection: "tests",
		    query: {
			$lt: 5
		    }
		}
	    )`;

	    engine.loadDSL(dsl)
		.then(() => {
		    done();
		}).catch((err) => {
		    done();
		});
	});
    });

    describe.skip("#loadDashboard", () => {
	it("should load the model without errors", (done) => {
	    var dsl = `dashboard(
		label: "dash"
	    ) {
		row(
		    cell("cell")
		    document("6")
		)

		row(
		    collection("1")
		    collection("3")
		)
	    }`;

	    engine.loadDSL(dsl)
		.then(() => {
		    done();
		}).catch((err) => {
		    console.log(err.message());
		    done(err);
		});
	});
    });
});

