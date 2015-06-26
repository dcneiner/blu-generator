var drudgeon = require( "drudgeon" );

function run( commands ) {
	function onError( err ) {
		this.log( "Error running a command:", err );
	}
	var steps = drudgeon( commands );
	steps.on( "starting.#", function( x ) {
		this.log( "running command", x );
	} );
	return steps.run()
		.then( undefined, onError );
}

module.exports = run;
