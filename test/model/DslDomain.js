/*
* Name : DslDomain.js
* Module : UnitTest
* Location : /test/unit/model/dslmodel
*
* History :
* 
* Version         Date           Programmer
* =================================================
* 0.0.1          2016-05-30     Polonio Davide
* -------------------------------------------------
* Rimossi metodi non utilizzati
* Rinominato registerCollection in register
*
* =================================================
* 0.0.1          2014-03-02     Serena Girardi
* -------------------------------------------------
* Codifica test.
* =================================================
*/

"use strict";

var DslDomain = require("../../src/model/DslDomain");
var MaapError = require("../../src/utils/MaapError");

var assert = require("assert");
const fs = require("fs");

describe("DslDomain", function() {
	var domain = null;

	describe("DslDomain TU-12", function () {

		it("Viene costruito", function(done) {
			domain = new DslDomain();
			done();
		});

		it("Non è nullo", function(done) {
			assert.notEqual(domain, null);
			done();
		});

		it("Ha un metodo loadDSL", function(done) {
			assert.notEqual(domain.loadDSL, null);
			done();
		});

		it("Ha un metodo register", function(done) {
			assert.notEqual(domain.register, null);
			done();
		});

		it("Ha un metodo getCollectionModel", function(done) {
			assert.notEqual(domain.getCollectionModel, null);
			done();
		});
	});

	/*

	describe("loadDSL() TU-13", function() {

		it("Viene passato un file esistente", function(done) {

			domain = new DslDomain();
			var content = fs.readFileSync(__dirname+"/sample/example.dsl", "utf-8");

			var StubClass = {
				strategy: {
					loadDSL: null
				},
				registerError: function () {},
				registerCollection: function () {}
			};

			StubClass.loadDSL = domain.loadDSL;

			StubClass.strategy.loadDSL = function (param1, param2, cb, eb) {
				
				var obj = {
					forEach: function () {}
				};

				cb(obj);
			};

			domain.loadDSL(content, function (err, results) {
				assert.notStrictEqual(results, null);
				assert.strictEqual(err, null);
				done();
			});
		});

		it("Viene passato un file non esistente", function(done) {
			
			domain = new DslDomain();
			var path = "non-existent.dsl";

			var StubClass = {
				strategy: {
					loadDSL: null
				},
				registerError: function () {}
			};

			StubClass.loadDSL = domain.loadDSL;

			StubClass.strategy.loadDSL = function (param1, param2, cb, eb) {
				
				var obj = {
					forEach: function () {}
				};

				cb(obj);
			};

			StubClass.loadDSL(path, function (err, results) {
				assert.notStrictEqual(err, null);
				done();
			});
		});

		it("Gestisce gli errori generati da strategy.loadDSLFile", function(done) {

			domain = new DslDomain();
			var path = __dirname+"/sample/example.dsl";

			var StubClass = {
				strategy: {
					loadDSL: null
				},
				registerError: function () {},
				registerCollection: function () {}
			};

			StubClass.loadDSL = domain.loadDSL;

			StubClass.strategy.loadDSL = function (param1, param2, cb, eb) {
				eb(new MaapError(1000));
			};

			StubClass.loadDSL(path,	function (err, results) {
				assert.deepEqual(err, new MaapError(1000));
				done();
			});			
		});
	});

	*/

	describe("register() TU-14", function() {

		it("Aggiunge una collection al registro", function (done) {

			domain = new DslDomain();

			var model = {
				getId: null,
				indexModel: {
					noMoreColumns: function () {}
				},
				showModel: {
					noMoreRows: function () {}
				},
				getName: null
			};

			model.getId = function () {
				return 1;
			};

			model.getName = function () {
				return "name";
			};

			var StubClass = {
				modelRegistry: [1],
				registerError: null
			};

			StubClass.registerError = function (err) {};

			StubClass.registerCollection = domain.register;

			StubClass.registerCollection(model);

			done();
		});

		it("Gestisce il caso in cui la collection sia già presente nel modelRegistry", function (done) {
			domain = new DslDomain();

			var model = {
				getId: null,
				indexModel: {
					noMoreColumns: function () {}
				},
				showModel: {
					noMoreRows: function () {}
				},
				getName: null
			};

			model.getId = function () {
				return 0;
			};

			model.getName = function () {
				return "name";
			};

			var StubClass = {
				modelRegistry: [1],
				registerError: null
			};

			StubClass.registerError = function (err) {
				assert.deepEqual(err, new MaapError(3001, "The collection 'name' with id '0' is defined multiple times"));
			};

			StubClass.registerCollection = domain.register;

			StubClass.registerCollection(model);

			done();
		});
	});

	describe("getCollectionModel() TU-15", function() {

		it("Restituisce la collection con l'id dato", function (done) {
			domain = new DslDomain();

			var StubClass = {
				modelRegistry: [1]
			};

			StubClass.getCollectionModel = domain.getCollectionModel;

			assert.strictEqual(StubClass.getCollectionModel(0), 1);

			done();
		});
	});

	describe("getErrors() TU-16", function() {

		it("Restituisce l'array di errori", function (done) {
			domain = new DslDomain();

			var StubClass = {
				errors: ["err1", "err2"]
			};

			StubClass.getErrors = domain.getErrors;

			assert.deepEqual(StubClass.getErrors(), ["err1", "err2"]);

			done();
		});
	});
});
