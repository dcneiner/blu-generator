require( "../setup" );
var path = require( "path" );
var templateFn = require( "../../src/template" );

describe( "Templates", function() {
	describe( "with valid template", function() {
		var template;

		before( function() {
			return templateFn( "./spec/data/one/template/v0.0.5" )
				.then( function( t ) {
					template = t;
				} );
		} );

		it( "should load data from template path", function() {
			template.should.eql( {
				commands: {
					before: {
						"npm-clear": {
							cwd: "./",
							cmd: {
								win32: "dir",
								"*": "ls"
							},
							args: {
								win32: [ "./node_modules" ],
								"*": [ "-al", "./node_modules" ]
							}
						}
					},
					after: {
						"npm-dependencies": {
							cwd: "./",
							cmd: {
								win32: "npm.cmd",
								"*": "npm"
							},
							args: [ "install", "autohost", "hyped", "when", "lodash", "fount" ]
						},
						"npm-libs": {
							cwd: "./",
							cmd: {
								win32: "npm.cmd",
								"*": "npm"
							},
							args: [ "install" ]
						},
					}
				},
				files: [
					path.resolve( "./spec/data/one/template/v0.0.5/.gitignore" ),
					path.resolve( "./spec/data/one/template/v0.0.5/.jshintrc" ),
					path.resolve( "./spec/data/one/template/v0.0.5/README.md" ),
					path.resolve( "./spec/data/one/template/v0.0.5/gulpfile.js" ),
					path.resolve( "./spec/data/one/template/v0.0.5/package.json.blu" ),
					path.resolve( "./spec/data/one/template/v0.0.5/resource.js.blu" ),
					path.resolve( "./spec/data/one/template/v0.0.5/src/index.js.blu" ),
				],
				prompts: [
					{
						message: "Project name",
						name: "projectName",
						type: "input"
					},
					{
						name: "description",
						type: "input",
						message: "Project description"
					},
					{
						name: "owner",
						type: "input",
						message: "GitHub Owner"
					},
					{
						name: "author",
						type: "input",
						message: "NPM Author"
					}
				],
				structure: {
					"./resource.js": "./resources/${resourceName}/resource.js"
				}
			} );
		} );
	} );
} );
