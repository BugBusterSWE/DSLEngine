// Type definitions for src/dslEngine.js
// Project: DSLEngine
// Definitions by: Polonio Davide <poloniodavide@gmail.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * Core class, it keep manage the connesion with MongoDB and run the DSL passed in text format.
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
 declare module "dslengine" {

    import * as mongoose from "mongoose";

    export class DSLEngine {

	/**
	 *
	 */
	constructor();

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
	connectTo(database : string): Promise<void>;

	/**
	 * @description
	 * Connect to the dabase to perform the action defined in the dsl through a
	 * defined connection.
	 * @param database {mongoose.Connection}
	 * Connection for the collection into the database to perform the action
	 * @throws {MaaPError}
	 */
	connectWith(connection : mongoose.Connection): void;

	/**
	 * @description
	 * Load the dsl into the engine to codifing it.
	 * @param dsl {string}
	 * The code of the dsl
	 * @throws {MaaPError[]}
	 */
	loadDSL(dsl : string): void;
    }

    export interface Dict {

      title : string,
      code : number,
      message : string
    }

    export class MaapError {

        toDict() : Dict;

        toString() : string;

        toError() : Error;
    }   
}
