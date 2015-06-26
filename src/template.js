var _ = require( "lodash" );
var fs = require( "./fs" );

function init( base ) {
	return fs.listFiles( base )
		.then( onFiles );
}

function attachFile( target, file ) {
	if ( /[.]prompt.js$/.test( file ) ) {
		target.prompts = require( file );
	} else if ( /[\/][.]structure.json$/.test( file ) ) {
		target.structure = require( file );
	} else if ( /[\/][.]commands.json$/.test( file ) ) {
		target.commands = require( file );
	} else if ( /[\/][.]context.js$/.test( file ) ) {
		target.context = require( file );
	} else {
		target.files.push( file );
	}
}

function onFiles( files ) {
	return _.reduce( files, function( acc, file ) {
		attachFile( acc, file );
		return acc;
	}, { files: [] } );
}

module.exports = init;
