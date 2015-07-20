var _ = require( "lodash" );
var fs = require( "./fs" );
var template = require( "./template" );
var expander = require( "./expander" );
var command = require( "./command" );
var yeo = require( "yeoman-generator" );

var blu = yeo.Base.extend( {
	init: function() {
		var done = this.async();
		template( this.sourceRoot() )
			.then( function( template ) {
				this.blu = template;
				done();
			}.bind( this ) );
	},
	runBefore: function() {
		var commands = this.blu.commands;
		if ( commands && !_.isEmpty( commands.before ) ) {
			var done = this.async();
			command.bind( this )( commands.before, done );
		}
	},
	runAfter: function() {
		var commands = this.blu.commands;
		if ( commands && !_.isEmpty( commands.after ) ) {
			var done = this.async();
			command.bind( this )( commands.after, done );
		}
	},
	ask: function() {
		if ( !this.blu.prompts ) {
			return;
		}
		var done = this.async();
		this.prompt( this.blu.prompts, function( answers ) {
			this.answers = answers;
			done();
		}.bind( this ) );
	},
	writeTemplate: function() {
		expander(
			this.fs,
			this.sourceRoot(),
			this.destinationRoot(),
			this.blu.context || {},
			_.merge( {}, this.answers, this.data ),
			this.blu.files,
			this.blu.structure || {}
		);
	}
} );

blu.api = {
	expand: expander,
	template: template,
	run: command,
	listFiles: fs.listFiles,
	listDirectories: fs.listDirectories
};

var _extend = blu.extend;
blu.extend = function ( protoProps, staticProps ) {
	protoProps = protoProps || {};

	// Only methods on the final generator prototype will run
	// so we mix our default lifecycle methods
	// into the new generator prototype if they were
	// not already defined.
	_.each( {
		initializing: "init",
		prompting: "ask",
		writing: "writeTemplate",
		install: "installDependencies"
	}, function ( method, key ) {
		if ( !protoProps.hasOwnProperty( key ) ) {
			protoProps[ key ] = function () {
				this[ method ]();
			};
		}
	} );

	return _extend.apply( this, [ protoProps, staticProps ] );
}

module.exports = blu;
