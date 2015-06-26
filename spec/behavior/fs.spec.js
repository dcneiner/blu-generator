require( "../setup" );
var path = require( "path" );
var removed;
var exists = false;

var rename = sinon.stub();

var fs = proxyquire( "../src/fs", {
	rimraf: function( remove, cb ) {
		removed = remove;
		cb();
	},
	fs: {
		exists: function( x, cb ) {
			cb( true );
		},
		existsSync: function() {
			return exists;
		},
		rename: rename
	}
} );

describe( "File System", function() {
	describe( "when finding directories", function() {
		var list;
		before( function() {
			return fs.listDirectories( path.resolve( "./spec" ) )
				.then( function( result ) {
					list = result;
				} );
		} );

		it( "should only return immediate subdirectories", function() {
			list.should.eql( [ "behavior", "data" ] );
		} );
	} );

	describe( "when finding files", function() {
		var list;
		before( function() {
			return fs.listFiles( path.resolve( "./spec/data/one/template/v0.0.5" ) )
				.then( function( result ) {
					list = result;
				} );
		} );

		it( "should list all files", function() {
			list.should.eql( [
				path.resolve( "./spec/data/one/template/v0.0.5/.commands.json" ),
				path.resolve( "./spec/data/one/template/v0.0.5/.gitignore" ),
				path.resolve( "./spec/data/one/template/v0.0.5/.jshintrc" ),
				path.resolve( "./spec/data/one/template/v0.0.5/.prompt.js" ),
				path.resolve( "./spec/data/one/template/v0.0.5/.structure.json" ),
				path.resolve( "./spec/data/one/template/v0.0.5/README.md" ),
				path.resolve( "./spec/data/one/template/v0.0.5/gulpfile.js" ),
				path.resolve( "./spec/data/one/template/v0.0.5/package.json.blu" ),
				path.resolve( "./spec/data/one/template/v0.0.5/resource.js.blu" ),
				path.resolve( "./spec/data/one/template/v0.0.5/src/index.js.blu" )
			] );
		} );
	} );
} );
