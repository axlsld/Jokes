"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCSVorJSON = isCSVorJSON;
exports.fileSelection = fileSelection;
exports.validateAndExecuteJokeSelection = validateAndExecuteJokeSelection;
exports.jokeProgram = jokeProgram;
var fs = require("fs");
var sync_1 = require("csv-parse/sync");
var dotenv = require("dotenv");
require("./env");
dotenv.config();
function getPrompt() {
    if (process.env.VITEST) {
        throw new Error("Prompt used during test import (forbidden)");
    }
    var promptSync = require('prompt-sync')();
    return promptSync;
}
function isCSVorJSON(choice) {
    var path;
    if (choice == '1') {
        if (!process.env.CSV_PATH) {
            throw new Error("No CSV_PATH in .env");
        }
        path = process.env.CSV_PATH;
    }
    else if (choice == '2') {
        if (!process.env.JSON_PATH) {
            throw new Error("No JSON_PATH in .env");
        }
        path = process.env.JSON_PATH;
    }
    else {
        console.log('Exiting the program...');
        path = 'end';
    }
    return path;
}
function fileSelection() {
    var prompt = getPrompt();
    console.log("---------------------------------------");
    console.log("This is a program that gives you a joke");
    console.log("based on the number you will input.");
    console.log("\nChoose the type of file you want:");
    console.log("- Type 1 for csv\n- Type 2 for json\n- Type anything else to exit.");
    console.log("---------------------------------------");
    var choice = prompt('Enter a number: ');
    return isCSVorJSON(choice);
}
function validateAndExecuteJokeSelection(input, jokes) {
    var id = parseInt(input);
    var checker = false;
    if (input == '0') {
        return false;
    }
    if ((id > 0 && id < jokes.length) && Number.isInteger(Number(input))) {
        console.log(jokes[id][1]);
        checker = true;
    }
    else {
        console.log('Invalid input or joke not found');
    }
    return checker;
}
function jokeSelection(jokes) {
    var prompt = getPrompt();
    while (true) {
        console.log("---------------------------------------");
        console.log("TYPE A NUMBER FROM 1 TO ".concat(jokes.length - 1, " TO GET A JOKE"));
        console.log("         or type \"0\" to exit");
        console.log("---------------------------------------");
        var input = prompt('Enter a number: ');
        console.log("---------------------------------------");
        var status_1 = validateAndExecuteJokeSelection(input, jokes);
        if (status_1 === false) {
            console.log('Exiting the program...');
            return false;
        }
        if (status_1 === true) {
            return true;
        }
    }
}
function jokeProgram() {
    while (true) {
        var pathChosen = fileSelection();
        if (pathChosen === 'end') {
            break;
        }
        if (!fs.existsSync(pathChosen)) {
            console.log("File not found.");
            continue;
        }
        var data = void 0;
        try {
            data = fs.readFileSync(pathChosen, 'utf8');
        }
        catch (err) {
            console.error("Error reading file: ", err);
            continue;
        }
        var array = void 0;
        if (pathChosen == process.env.CSV_PATH) {
            array = (0, sync_1.parse)(data, { columns: false, skip_empty_lines: true, relax_quotes: true, relax_column_count: true });
        }
        else {
            var arrayJSON = JSON.parse(data);
            array = arrayJSON.map(function (obj, index) { return [index + 1, obj.joke]; });
        }
        var continueProgram = jokeSelection(array);
        if (!continueProgram)
            break;
    }
}
if (require.main === module && process.env.VITEST !== 'true') {
    jokeProgram();
}
