// Type definitions for src/dslEngine.js
// Project: DSLEngine
// Definitions by: Polonio Davide <poloniodavide@gmail.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

 declare module "dslengine" {

    import * as mongoose from "mongoose";

    export class DSLEngine {
        constructor();
	// Da trovare nella documentazione di MongoDB
	connectTo(database : string): Promise<Object>;
	connectWith(connection : mongoose.Connection): void;
	loadDSL(dsl : string): void;
	getCollections() : Promise<Collection[]>;
	getIndexPage(id : string, option : OptionDisplayIndexPage) : Promise<IndexPage>;
	getShowPage(collectionId : string, documentId : string) : Promise<Document[]>;
	deleteDocument(collectionId : string, documentId : string) : Promise<void>;
	// Che sia da templetizzare? Il punto è che l'Object è la struttura 
	// comune ad ogni interrogazione MongoDB. E' come la struttura a
	// tabelle per SQL.
	editDocument(collectionId : string, documentId : string, content : Object) : Promise<Object>;
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

    export class MaapError {
        toDict() : Dict;
        toString() : string;
        toError() : Error;
    }   
}

