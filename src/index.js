var _ = require( "lodash" );
var fs = require( "./fs" );
var template = require( "./template" );
var expander = require( "./expander" );
var command = require( "./command" );
var yeo = require( "yeoman-generator" );

var blu = yeo.Base.extend( {
	constructor: function() {
		yeo.Base.apply( this, arguments );
	},
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

blu.extend = require( "class-extend" ).extend;

module.exports = blu;
