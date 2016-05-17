var mongoose = require("mongoose");
var DslDomain = require("./model/DslDomain.js");
var MaapError = require("./utils/MaapError.js");

/**
 * Core class, it keep manage the connesion with MongoDB and run the DSL passed 
 * in text format.
 * 
 * @history
 * | Name | Action performed | Date |
 * | ---  | ---              | ---  |
 * | Andrea Mantovani | Update document and correct import | 2016-05-12 |
 * | Andrea Mantovani | Create class | 2016-05-11 |
 * 
 * @author Andrea Mantovani
 * @license MIT
 */
var DSLEngine = function () {
    this.domain = undefined;
};

/**
 * @description
 * Connect to the dabase to perform the action defined in the dsl througt the
 * his URL.
 * @param database {string}
 * URL for the collection into the database to perform the action. The url is
 * in the form:
 * `<dbuser>:<dbpassword>@<address>:<port>/<database>/<collection>`
 * @return {Promise}
 * The promise of the connection to the db and initial process. The promise
 * is resolve with nothing if no errors is occurred, otherwise with the
 * errors. If an istance of DSLEngine was create, the promise is always 
 * resolve.
 */
DSLEngine.prototype.connectTo = function (database) {
    var self = this;

    return new Promise((resolve, reject) => {
	if (self.domain === undefined) {
	    var connection = mongoose.createConnection(
		`mongodb://${database}`
	    );

	    connection.on("error", function(err) {
		reject(err);
	    });

	    connection.on("open", function(ref) {
		// Error to read the macro
		try {
		    // Use the connection to perform the DSL
		    self.domain = new DslDomain(connection);
		} catch (err) {
		    reject(err);
		}
		
		resolve(ref);
	    });
	} else { 
	    resolve();
	}
    });
};

/**
 * @description
 * Connect to the dabase to perform the action defined in the dsl through a
 * defined connection.
 * @param database {mongoose.Connection}
 * Connection for the collection into the database to perform the action
 * @throws {MaaPError}
 */
DSLEngine.prototype.connectWith = function (connection) {
    if (this.domain === undefined) {
	this.domain = new DslDomain(connection);
    }
};

/**
 * @description
 * Load the dsl into the engine to codifing it.
 * @param dsl {string}
 * The code of the dsl
 * @throws {MaaPError[]}
 */
DSLEngine.prototype.loadDSL = function (dsl) {
    this.domain.loadDSL(dsl);
    
    // Errors catched throughout the codification
    var errors = this.domain.getErrors();
    if (errors !== undefined) {
	throw errors;
    }
};

/**
 * @description 
 * Return the summary of any collections loaded in the engine.
 * @return {Array<Object>}
 * The summary object have three attributs:
 * * id: Id of the collection
 * * name: Name of the collection
 * * label: Label of the collection
 */
DSLEngine.prototype.getCollections = function () {
    var models = this.domain.getCollectionModels();
    var collections = [];

    models.forEach((model) => {
	collections.push({
	    id: model.getId(),
	    name: model.getName(),
	    label: model.getLabel()
	});
    });

    return collections;
};

/**
 * @description
 * Query the dabase to get the information to build the index page.
 * @param id {string}
 * Id of the collection where is define the index page information
 * @param option {Object}
 * The query to show the index page. The query is a object with the follow 
 * attributes:
 * * page
 * * sort
 * * order
 * @return {Promise<IndexPage>}
 * The promise for the informations to build the Index Page. The promise is 
 * resolve with an IndexPage, otherwise it is reject with a MaapError.
 */
DSLEngine.prototype.getIndexPage = function (id, option) {
    var collection = this.domain.getCollectionModel(id);
    
    return new Promise((resolve, reject) => {
	if (collection) {
	    var indexModel = collection.getIndexModel();
	    indexModel.getData(
		option.page,
		option.sort,
		option.order,
		(data) => {
		    resolve(data);
		},
		(err) => {
		    reject(err);
		}
	    );
	} else {
	    reject(new MaapError(7000));
	}
    });
};

/** 
 * @description
 * Query the dabase to get the information to build the Show Page.
 * @param collectionId {string}
 * Id of the collection where is define the show page information
 * @param documentId {string}
 * Id of the document where is store the datas to populate the Show Page
 * @return {Promise<ShowPage>}
 * The promise for the informations to build the Show Page. The promise is 
 * resolve with an ShowPage, otherwise it is reject with a MaapError.
 */
DSLEngine.prototype.getShowPage = function (collectionId, documentId) {
    var collection = this.domain.getCollectionModel(collectionId);
    
    return new Promise((resolve, reject) => {
	if (!collection) {
	    reject(new MaapError(18000));
	} else {
	    var showModel = collection.getShowModel();
	    showModel.getData(
		documentId,
		(data) => {
		    resolve(data);
		},
		(error) => {
		    reject(error);
		}
	    );
	}
    });
};

/**
 * @description
 * Delete the collection refered by id of the collection and document.
 * @param collectionId {string}
 * Id of the collection
 * @param documentId {string}
 * Id of the document
 * @return {Promise<void>}
 * The promise is reject with a MaapError if an error has been occurred, 
 * otherwise it is resolve with nothing.
 */
DSLEngine.prototype.deleteDocument = function (collectionId, documentId) {
    var collection = this.domain.getCollectionModel(collectionId);

    return new Promise((resolve, reject) => {
	if (!collection) {
	    reject(new MaapError(18000));
	} else {

	    var showModel = collection.getShowModel();
	    showModel.deleteDocument(
		documentId,
		() => {
		    resolve();
		},
		(error) => {
		    reject(error);
		}
	    );
	}
    });
};

/**
 * @description
 * Edit the document into the collection selected by id with the content
 * specifeied.
 * @param collectionId {string}
 * The id of the collection
 * @param documentId {string}
 * The id of the document
 * @param content {Object}
 * The content to edit the document
 * @return {Promise<Object>}
 * The promise represent the asynchronous editing operation of the document.
 * The promise is resolve with the up-to-date data and it is reject with a 
 * MaapError if a error is occurred.
 */
DSLEngine.prototype.editDocument = function (collectionId, documentId, content) {
    var collection = this.domain.getCollectionModel(collectionId);

    return new Promise((resolve, reject) => {
	if (!collection) {
	    reject(new MaapError(18000));
	} else {
	    var showModel = collection.getShowModel();
	    showModel.updateDocument(
		documentId,
		content,
		(data) => {
		    resolve(data.toObject);
		},
		(error) => {
		    reject(error);
		}
	    );
	}
    });
};

module.exports = DSLEngine;

