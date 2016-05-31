var DocumentSchema = require("./DocumentSchema");

var DocumentEngine = function (db, models) {
    this.registry = [];

    var buff = [];
    buff.push(models);

    buff.forEach((model) => {
	model.bind(db.model(model.getName(), DocumentSchema)); 
        this.registry[model.getId()] = model;
    });
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
DSLEngine.prototype.deleteDocument = function (documentId) {
    var showModel = this.registry[documentId];

    return new Promise((resolve, reject) => {
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
DSLEngine.prototype.editDocument = function (documentId, content) {
    var showModel = this.registry[documentId];

    return new Promise((resolve, reject) => {
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
DSLEngine.prototype.getShowPage = function (collectionId, documentId) {
    var showModel = this.registry[documentId];
    
    return new Promise((resolve, reject) => {
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
    });
};
