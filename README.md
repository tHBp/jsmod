# jsmod

Module to replace contents of javascript file using AST traversal! :rocket:

## Getting Started

```
$ npm install jsmod
```

## Usage

```javascript
const jsmod = require("jsmod");

const { count, files } = await jsmod({
    files: ["/path/to/file-1", "/path/to/file-2", "/path/to/file-3"],
    filterFiles: ({ fileContents }) => fileContents.match("var a = 42;"),
    traverseOptions: {
        enter: function(node, parent) {
            if (node.type === "Literal" && node.value === "somePropertyName") {
                node.value = "some_property_name";
            }
        }
    },
    generateOptions: {
        format: {
            quotes: "double"
        }
    }
});
```

## API

### jsmod(options)

Reads and modifies an array of files and returns a promise that resolves when everything completes.

#### options.files

Type: `Array`<br/>
Default: `none`<br/>
Required: `yes`

Array of files paths to be read.

#### options.traverseOptions

Type: `Object`<br/>
Default: `none`<br/>
Required: `yes`

Traverse options passed to [estraverse](https://github.com/estools/estraverse).

#### options.filterFiles({ fileName, fileContents })

Type: `Function`<br/>
Default: `none`<br/>
Required: `no`

Filter function to filter/ignore files based on file name or file contents.

This can be used to remove files which don't match certain criteria which you may wish to ignore.

Return `true` if file is to be considered for traversal/replacement, else return `false` if file is to be ignored.

#### options.generateOptions

Type: `Object`<br/>
Default: `none`<br/>
Required: `no`

Generate options passed to [escodegen](https://github.com/estools/escodegen).

## License
MIT © [The Half Blood Prince](mailto:thehalfbloodprince.github@gmail.com)