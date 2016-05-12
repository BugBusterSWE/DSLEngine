var engine = require("../");
var chai = require('chai')
chai.use(require('chai-as-promised'));

describe("Initialize", () => {
    // Subject of the tests
    var toTest;

    before(() => {
	toTest = new engine();
    });

    describe("#connectionToDbWithoutParam", () => {
	it("should reject the promise", () => {
	    var promise = toTest.connectTo();

	    return chai.expect(promise).to.be.rejected;
	});
    });
});
