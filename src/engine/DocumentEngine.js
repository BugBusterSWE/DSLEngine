var DocumentModel = require("../model/DocumentModel");
var AttributeReader = require("../utils/AttributeReader");
var ModelNotFoundException = require("../utils/modelNotFoundException");

var _LABEL = "document";

var DocumentEngine = function (node) {
    this.registry = {};
    this.node = node;
    
    this.getDocumentModel = getDocumentModel.bind(this);

    this.node.onLoad(register.bind(this));
    this.node.onEjectToken(saveEnvironment.bind(this));
    this.node.onPushToken(loadEnvironment.bind(this));
    this.node.on("getIdDocumentByLabel", getIdByLabel.bind(this));
};

/**
 * @description
 * Delete the collection refered by id of the document.
 * @param documentId {string}
 * Id of the document
 * @return {Promise<void>}
 * The promise is reject with a MaapError if an error has been occurred, 
 * otherwise it is resolve with nothing.
 */
DocumentEngine.prototype.deleteDocument = function (id, documentId) {
    var documentModel = this.registry[id];

    return new Promise((resolve, reject) => {
        var showModel = documentModel.getShowModel();
        
	if (!showModel) {
	    reject(new MaapError(18000));
	} else {

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
 * @param documentId {string}
 * The id of the document
 * @param content {Object}
 * The content to edit the document
 * @return {Promise<Object>}
 * The promise represent the asynchronous editing operation of the document.
 * The promise is resolve with the up-to-date data and it is reject with a 
 * MaapError if a error is occurred.
 */
DocumentEngine.prototype.editDocument = function (id, content) {
    var documentModel = this.registry[id];

    return new Promise((resolve, reject) => {
	var showModel = documentModel.getShowModel();
        
        if (!showModel) {
	    reject(new MaapError(18000));
	} else {
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

/** 
 * @description
 * Query the dabase to get the information to build the Show Page.
 * @param documentId {string}
 * Id of the document where is store the datas to populate the Show Page
 * @return {Promise<ShowPage>}
 * The promise for the informations to build the Show Page. The promise is 
 * resolve with an ShowPage, otherwise it is reject with a MaapError.
 */
DocumentEngine.prototype.getShowPage = function (id, documentId) {
    var documentModel = this.registry[id];
    
    return new Promise((resolve, reject) => {
        if (!documentModel) {
	    reject(new ModelNotFoundException('document', id));
	} else {
	    var showModel = documentModel.getShowModel();
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

DocumentEngine.prototype.list = function () {
    var models = this.getDocumentModels();
    var documents = [];

    for (var i=0; i<models.length; i++) {
	documents.push({
	    id: models[i].getId(),
	    name: models[i].getName(),
	    label: models[i].getLabel()
	});
    }

    return documents;
};

function getDocumentModel() {
    var models = [];
    
    for (var id in this.registry) {
	if (this.registry.hasOwnProperty(id)) {
	    models.push(this.registry[id]);
	}
    }
    
    return models;
}

function getIdByLabel(label, callback) {
    var id = undefined;

    console.log(this.registry);

    for (document in this.registry) {
	console.log(document);
	if (this.registry[document].getLabel() === label) {
	    id = document;
	    break;
	}
    }

    if (id == undefined) {
        callback(new ModelNotFoundException('document', label));
    } else {
        callback(undefined, id);
    }
}

function loadEnvironment(token) {
    var loadModules = token.load(_LABEL);
    this.registry = loadModules || {};
}

function register(models) { 
    models.forEach((model) => {
        if (model instanceof DocumentModel) {
            this.registry[model.getId()] = model;
            // Right model register with success
            this.node.emitReply();
        }
    });
}

function saveEnvironment(token) {
    token.save(_LABEL, this.registry);
}

module.exports = DocumentEngine;

