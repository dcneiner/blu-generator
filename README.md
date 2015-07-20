## blu-generator
A set of conventions (based on blu) for [`yeoman-generator`](https://github.com/yeoman/generator). Provides useful features with minimal effort.

## Example
The simplest example that will work (uses default yo life-cycle triggers for blu methods):

```javascript
var blu = require( "blu-generator" );
module.exports = blu.extend( {} );
```

And when defining yo life-cycle methods, you can call the blu helpers directly (these methods are automatically wired up if the related events are not defined by your generator):

```javascript
var blu = require( "blu-generator" );

module.exports = blu.extend( {
	initialize: function() {
		// ... custom code ...
		this.init();
	},
	prompting: function() {
		// ... custom code ...
		this.ask();
		// ... custom code ...
	},
	writing: function() {
		// ... custom code ...
		this.writeTemplate();
	},
	install: function() {
		// ... custom code ...
		this.installDependencies();
	}
} );
```

## API

### init()
Loads the template from the current generator's templates path and sets the resulting data structure on the `blu` property. _This is automatically called during `initialize` unless your generator also defines an `initialize` method or section. In that case, call `this.init()` within the `initialize` step of your generator to use this behavior._

### runBefore()
Used to execute any before commands set in the `.commands.json` file via `drudgeon`.

### runAfter()
Used to execute any after commands set in the `.commands.json` file via `drudgeon`.

### ask()
Sends the prompts specified in the `.prompts.js` file to `inquirer` and then sets the generator's `answer` property to the results. _This is automatically called during `prompting` unless your generator also defines an `prompting` method or section. In that case, call `this.ask()` within the `prompting` step of your generator to use this behavior._

### writeTemplate()
Copies all files from the generator's templates folder to a matching structure in the target, passing any file ending with a `.blu` extension to `lodash`'s template engine before its written. _This is automatically called during `writing` unless your generator also defines an `writing` method or section. In that case, call `this.writeTemplate()` within the `writing` step of your generator to use this behavior._

### installDependencies()
This is not a special blu method, but this yo method it is automatically called during `install` unless your generator also defines an `install` method or section. In that case, call `this.installDependencies()` within the `install` step of your generator to use this behavior.

## Concepts

### Templating
All files are processed first by [`EJS`](https://github.com/mde/ejs) and then [`lodash`](https://github.com/lodash/lodash) templating functions. The data required by these templates can be provided through prompts and setting the generator's `data` property. Code imports can be provided to the templates by including a `.context.js` file that returns a hash containing the aliased libraries/functions required by the templates.

Only files with a `.blu` extension will be treated as templates - the resulting file will omit this extension. All other files are simply copied from the generator's template folder to a matching folder structure in the target.

> Note: the reason for two templating engines is that EJS supports line "slurping": the removal of any empty lines that would be included as the result of a failing conditional code block. Lodash is included because it supports the `${}` which doesn't introduce HTML escaping and is much simpler/cleaner when all you want to do is include a template variable in your code.

### Prompts
A `.prompt.js` file within a generator's `templates` directory specifies how to collect each template variable. [`Inquirer`](https://github.com/SBoudrias/Inquirer.js) is used to collect answers so the metadata provided by this file can take full advantage of its features.

#### Prompt Array
```javascript
// a very simple template with only one variable would only need a single prompt
module.exports = [
	{
		name: 'projectName',
		type: 'input',
		message: 'Project name'
	}
];
```

### Context
The optional '.context.js' file should return a hash with anything required by the templates that are not provided by the prompts.

```javascript
// make environment variables available to the templates easily
module.exports = {
	'environment': process.env
}
```

### Structure
`blu` allows more control over where template files are placed through an optional `.structure.json` file. It provides a map of template files to a relative destination path that can contain template variables.

> Note: the key and value paths should be relative to the repository root.

```json
{
	"./sourceFile.js": "./src/things/${thingName}.js"
}
```

Given a value of "test1" for `thingName`, a copy of `sourceFile.js` would be saved to `./src/things/test1.js` after running it through `lodash`'s template function.

### Commands
Before and after sets of shell commands can be specified using the optional '.commands.json'. To understanding all the features available in specifying these commands, see [`Drudgeon`'s](https://github.com/leankit-labs/drudgeon) documentation.

> Note: before and after commands refer to when the run relative to fulfilling the templates.

This example demonstrates before and after sets of tasks. The before will delete the local `node_modules` folder (if it exists) and then install any pre-defined package dependencies in one step and then install another set of libraries as dependencies.
```json
{
	"before": {
		"npm-clear": {
			"cwd": "./",
			"cmd": {
				"win32": "rmdir",
				"*": "rm"
			},
			"args": {
				"win32": [ "./node_modules", "/s" ],
				"*": [ "-rf", "./node_modules" ]
			}
		}
	},
	"after": {
		"npm-libs": {
			"cwd": "./",
			"cmd": {
				"win32": "npm.cmd",
				"*": "npm"
			},
			"args": [ "install" ]
		}
	}
}
```
