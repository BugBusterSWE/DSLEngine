// Type definitions for src/dslEngine.js
// Project: DSLEngine
// Definitions by: Polonio Davide <poloniodavide@gmail.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

 declare module "dslengine" {

    import * as mongoose from "mongoose";

    export class DSLEngine {
        constructor();

        createToken() : Token;
        connectTo(database : string) : Promise<Object>;
        connectWith(connection : mongoose.Connection) : void;
        loadDSL(dsl : string, token? : Token) : Token;
    }

    export interface Token {}

    export interface ModelEngine {}

    export class CellEngine implements ModelEngine {}

    export class CollectionEngine implements ModelEngine {
        constructor(token : Token);

        deleteDocument(collectionId : string, documentId : string) : Promise<void>;
        editDocument(collectionId : string, documentId : string, content : Object) : Promise<Object>;
        getIndexPage(id : string, option : OptionDisplayIndexPage) : Promise<IndexPage>;
        getShowPage(collectionId : string, documentId : string) : Promise<Document[]>;
        list() : Promise<Collection[]>;
    }
    
    export class DashboardEngine implements ModelEngine {}

    export interface DocumentEngine implements ModelEngine {
        constructor(token : Token);

	    deleteDocument(documentId : string) : Promise<void>;
        editDocument(documentId : string, content : Object) : Promise<Object>;
        getShowPage(documentId : string) : Promise<Document[]>;
    }
    
    export interface Collection {
    	id : string;
        name : string;
        label : string;
    }

    export interface HeaderIndexPage {
        label : string;
        name : string;
        selectable : boolean;
        sortable : boolean;
    }

    export interface IndexPage {
    	id : string;
        name : string;
        label : string;
        numdocs : number;
        perpage : number;
        header : Array<HeaderIndexPage>;
        documents : Array<IndexDoc>;
    }

    export interface IndexDoc {
    	id : string;
	    data : Array<InteractiveDocument>
    }

    export interface Document {
        label : string;
        name : string;
        // Qua dipende dalla query
        raw : Object;
        // Il risultato di una funzione JavaScript.
        // Un malefico retaggio dal passato.
        data : any;
    }

    export interface InteractiveDocument extends Document {
	    selectable : boolean;
	    sortable : boolean;
    }

    export interface Dict {
   	    title : string;
     	code : number;
      	message : string;
    }

    export interface OptionDisplayIndexPage {
        page : number;
    	sort : string;
	    order : string;
    }

    export interface MaapError {
        toDict() : Dict;
        toString() : string;
        toError() : Error;
    }   
}

