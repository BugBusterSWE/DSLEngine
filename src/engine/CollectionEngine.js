var CollectionModel = require("../model/CollectionModel");
var AttributeReader = require("../utils/AttributeReader");
var ModelNotFoundException = 
    require("../utils/modelNotFoundException");

var _LABEL = "collection";

/**
 */
var CollectionEngine = function (node) {
    this.registry = {};
    this.node = node;
    
    this.node.onLoad(register.bind(this));
    this.node.onEjectToken(saveEnvironment.bind(this));
    this.node.onPushToken(loadEnvironment.bind(this));
    this.node.on("getIdCollectionByLabel", getIdByLabel.bind(this));
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
CollectionEngine.prototype.deleteDocument = function (id, documentId) {
    var collection = this.registry[id];
    
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
CollectionEngine.prototype.editDocument = function (id, documentId, content) {
    var collection = this.registry[id];

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

CollectionEngine.prototype.getCollectionModels = function () {
    var models = [];

    for (var id in this.registry) {
	if (this.registry.hasOwnProperty(id)) {
	    models.push(this.registry[id]);
	}
    }

    models.sort(compareCollectionWeight);
    
    return models;
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
CollectionEngine.prototype.getIndexPage = function (id, option) {
    var collection = this.registry[id];
    option = option || {};
    
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
	    reject(new ModelNotFoundException(id, 'collection'));
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
CollectionEngine.prototype.getShowPage = function (id, documentId) {
    var collection = this.registry[id];
    
    return new Promise((resolve, reject) => {
	if (!collection) {
	    reject(new ModelNotFoundException(id, 'collection'));
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

CollectionEngine.prototype.list = function () {
    var models = this.getCollectionModels();
    var collections = [];

    for (var i=0; i<models.length; i++) {
	collections.push({
	    id: models[i].getId(),
	    name: models[i].getName(),
	    label: models[i].getLabel()
	});
    }

    return collections;
};

function compareCollectionWeight(a, b) {
    var aw = a.getWeight();
    var bw = b.getWeight();

    if (aw < bw) {
	return -1;
    }
    if (aw > bw) {
	return 1;
    }
    return 0;
};

function getIdByLabel(label, callback) {
    var id = undefined;

    for (collection in this.registry) {
	if (this.registry[collection].getLabel() === label) {
	    id = collection;
	    break;
	}
    }
    
    if (id == undefined) {
        callback(new ModelNotFoundException('collection', label));
    } else {
        callback(undefined, id);
    }
}

function loadEnvironment(token) {
    var loadModules = token.load(_LABEL);
    // Clear the environment if no models is loaded
    this.registry = loadModules || {};
}

/**
 * @description
 * Insert into registry the model that are a instance of CollectionModel.
 * In registry, the model to be index with the id of the collection.
 * @param models {Model[]} 
 * Models loaded 
 */
function register(models) { 
    models.forEach((model) => {
        if (model instanceof CollectionModel) {
            this.registry[model.getId()] = model;
            // Right model register with success
            this.node.emitReply();
        }
    });
}

function saveEnvironment(token) {
    token.save(_LABEL, this.registry);
}

module.exports = CollectionEngine;

