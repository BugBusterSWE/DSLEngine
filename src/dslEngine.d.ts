// Type definitions for src/dslEngine.js
// Project: DSLEngine
// Definitions by: Polonio Davide <poloniodavide@gmail.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "dslengine" {

    import * as mongoose from "mongoose";
    import {Promise} from "es6-promise";

    export interface DSLEngine {
	cell() : CellEngine;
	collection() : CollectionEngine;
	dashboard() : DashboardEngine;
	document() : DocumentEngine;
	ejectSafelyToken() : Token;
	generateToken(db : mongoose.Connection) : Token;
	loadDSL(dsl : string) : Promise<void>;
	pushToken(token : Token) : void;
    }

    export interface Token {}

    interface ModelEngine {}

    export interface CollectionEngine extends ModelEngine {
        getIndexPage(
	    id : string, 
	    option : OptionDisplayIndexPage
	) : Promise<IndexPage>;

        getShowPage(
	    collectionId : string, 
	    documentId : string
	) : Promise<Document[]>;
        
	list() : Collection[];
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
        header : HeaderIndexPage[];
        documents : IndexDoc[];
    }

    export interface IndexDoc {
    	id : string;
	data : InteractiveDocument[];
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

    export interface OptionDisplayIndexPage {
        page : number;
    	sort : string;
	order : string;
    }

    export interface NoConnectionEstabilished {}

    interface Error {
	message() : string;
    }

    export interface CollectionNotFoundException extends Error {}
    export interface DSLSyntaxException extends Error {}
    export interface NoConnectionEstabilished extends Error {}
    export interface NoTokenConnectedException extends Error {}
    export interface RequiredParamException extends Error {}
    export interface TokenAlreadyInsertException extends Error {}
    export interface UnexpectedParamException extends Error {}
    export interface WrongTypeException extends Error {}
}

