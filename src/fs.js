var fs = require( "fs" );
var path = require( "path" );
var _ = require( "lodash" );
var when = require( "when" );
var lift = require( "when/node" ).lift;

function listDirectories( parent ) {
	parent = parent.replace( /~/, process.env.HOME );
	function filterDir( file, stat ) {
		return stat.isDirectory() ? file : undefined;
	}
	function onFile( file ) {
		var fullPath = path.resolve( parent, file );
		return lift( fs.stat )( fullPath )
			.then( filterDir.bind( undefined, file ) );
	}
	function onFiles( files ) {
		return when.all( _.map( files, onFile ) )
			.then( _.filter );
	}
	return lift( fs.readdir )( parent )
		.then( onFiles );
}

function listFiles( current ) {
	function fork( file, stat ) {
		if ( stat.isDirectory() ) {
			return file === ".git" || file === "node_modules" ? undefined : listFiles( path.resolve( current, file ) );
		} else {
			return path.resolve( current, file );
		}
	}
	function onFile( file ) {
		var fullPath = path.resolve( current, file );
		return lift( fs.stat )( fullPath )
			.then( fork.bind( undefined, file ) );
	}
	function onFiles( files ) {
		return when.all( _.map( files, onFile ) )
			.then( _.flatten )
			.then( _.filter );
	}
	return lift( fs.readdir )( current )
		.then( onFiles );
}


module.exports = {
	listDirectories: listDirectories,
	listFiles: listFiles
};
