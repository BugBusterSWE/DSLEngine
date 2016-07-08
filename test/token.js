var chai = require("chai");

var dslengine = require("../src/dslEngine");
var TokenAlreadyInsertException = require(
    "../src/utils/tokenAlreadyInsertException"
);
var NoTokenConnectedException = require(
    "../src/utils/noTokenConnectedException"
);

describe("Token", () => {
    var token;
    var engine;

    before(() => {
	engine = new dslengine.engine();
    });
    
    describe("#createToken", () => {
        it("should return a not undefined token", () => {
            token = engine.generateToken(undefined);
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
    
    describe("#removeToken", () => {
        it("shoud return the same token", () => {
            chai.expect(engine.ejectSafelyToken()).to.equal(token);
        });
    });
    
    describe("#removeTokenOneOtherTime", () => {
        it("shoud throw exception NoTokenConnectedException", () => {
            chai.expect(engine.ejectSafelyToken.bind(engine)).to.throw(
                NoTokenConnectedException
            );
        });   
    });
});

