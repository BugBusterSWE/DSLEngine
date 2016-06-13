var DocumentModel = require("../model/DocumentModel");
var AttributeReader = require("../utils/AttributeReader");

var _LABEL = "document";

var DocumentEngine = function (node) {
    this.registry = [];
    this.node = node;
    
    this.node.onLoad(register.bind(this));
    this.node.onEjectToken(saveEnvironment.bind(this));
    this.node.onPushToken(loadEnvironment.bind(this));
    this.node.on("getIdDocumentById", getIdByLabel.bind(this));
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
	var showModel = documentModel.getShowModel();
        
        if (!showModel) {
	    reject(new MaapError(18000));
	} else {
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

function getIdByLabel(label, callback) {
    var doc = this.registry.find((document) => {
        return document.getLabel() === label;    
    });
    
    if (doc === undefined) {
        callback(new MaapError(18000));
    } else {
        callback(undefined, doc.getId());
    }
}

function loadEnvironment(token) {
    this.registry = token.load(_LABEL);
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

