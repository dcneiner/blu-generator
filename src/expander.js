var path = require( "path" );
var _ = require( "lodash" );
var nodeFS = require( "fs" );
var mkdirp = require( "mkdirp" );
var ejs = require( "ejs" );

var defaultContext = {
	"_": _
};

function expand( fs, base, target, context, state, files, structure ) {
	var imports = _.merge( {}, defaultContext, context );
	var dirMap = _.reduce( structure || {}, function( acc, p, k ) {
		var fn = _.template( p, imports );
		acc[ k.replace( /[.]blu$/, "" ) ] = fn( state );
		return acc;
	}, {} );

	function onContent( file, content ) {
		var partial = file.replace( base, "." ).replace( /[.]blu$/, "" );
		var newPath = dirMap[ partial ]
			? path.join( target, dirMap[ partial ] )
			: path.join( target, partial );
		var dir = path.dirname( newPath );
		if( path.extname( file ) === ".blu" ) {
			var ejsFn = ejs.compile( content, imports );
			content = ejsFn( state );
			var ldFn = _.template( content, imports );
			content = ldFn( state );
			newPath = newPath.replace( /[.]blu$/, "" );
		}
		if( content.trim() ) {
			if ( !nodeFS.existsSync( dir ) ) {
				mkdirp.sync( dir );
			}
			fs.write( newPath, content );
		}
	}

	_.each( files, function( file ) {
		onContent( file, fs.read( file ) );
	} );
}

module.exports = expand;
