const { parseScript } = require("esprima");
const { traverse } = require("estraverse");
const { generate } = require("escodegen");
const { readFile, writeFile } = require("fs").promises;

const readSingleFile = fileName => readFile(fileName, "utf8").then(fileContents => ({ fileName, fileContents }));

const batchRead = filesArray => {
    const promises = [];
    filesArray.forEach(fileName => promises.push(readSingleFile(fileName)));
    return Promise.all(promises);
};

/**
 * @typedef {Object} PropReturn
 * @property {number} count - The number of files touched by replacer.
 * @property {Array<string>} files - The paths of the files replaced by the replacer.
 */
/**
 * @summary Replace contents of Javascript source files with custom AST traversal logic.
 * @param  {Array<string>} files - Array of string paths to the files.
 * @param  {Object} traverseOptions - The traversal object passed to <code>estraverse</code>.
 * @param  {Object} [generateOptions] - The generate options object passed to <code>escodegen</code>.
 * @returns {PropReturn} - The return value
 */
module.exports = async ({ files, filterFiles, traverseOptions, generateOptions }) => {
    if (!traverseOptions || !Array.isArray(files)) {
        return {
            count: 0,
            files: []
        };
    }
    const writeFilesPromises = [];
    let filesWithContent = await batchRead(files);
    if (filterFiles && typeof filterFiles === "function") {
        filesWithContent = filesWithContent.filter(filterFiles);
    }
    filesWithContent.forEach(({ fileName, fileContents }) => {
        const ast = parseScript(fileContents);
        traverse(ast, traverseOptions);
        const code = generate(ast, generateOptions || {});
        writeFilesPromises.push(writeFile(fileName, code, "utf8"));
    });
    await Promise.all(writeFilesPromises);
    return {
        count: writeFilesPromises.length,
        files: filesWithContent.map(prop => prop.fileName)
    };
}