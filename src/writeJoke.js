"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var promptSync = require("prompt-sync");
var dotenv = require("dotenv");
dotenv.config();
var prompt = promptSync();
function fileSelection() {
    console.log("---------------------------------------");
    console.log("This is a program that makes you write");
    console.log("a joke.");
    console.log("\nChoose the type of file you want:");
    console.log("- Type 1 for csv\n- Type 2 for json\n- Type anything else to exit.");
    console.log("---------------------------------------");
    var choice = prompt('Enter a number: ');
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
function addJokeCSV(filePath, input) {
    var _a;
    var data = fs.readFileSync(filePath, 'utf8');
    var rows = data.split('\n');
    var lastRow = (_a = rows[rows.length - 1]) === null || _a === void 0 ? void 0 : _a.split(',');
    var lastId = parseInt(lastRow[0]);
    var newId = lastId + 1;
    var safeInput = input.replace(/"/g, '""');
    var newJoke = "\n".concat(newId, ",\"").concat(safeInput, "\"");
    fs.appendFileSync(filePath, newJoke);
    console.log("\n***************************************");
    console.log("Joke no.".concat(newId, " added successfully!"));
    console.log("***************************************");
}
function addJokeJSON(filePath, input) {
    var data = fs.readFileSync(filePath, 'utf8');
    var json = JSON.parse(data);
    var newId = 1;
    if (json.length > 0) {
        var lastItem = json[json.length - 1];
        var lastId = Number(lastItem.id);
        if (!isNaN(lastId)) {
            newId = lastId + 1;
        }
    }
    json.push({ id: newId, joke: input });
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log("\n***************************************");
    console.log("Joke no.".concat(newId, " added successfully!"));
    console.log("***************************************");
}
while (true) {
    var pathChosen = fileSelection();
    if (pathChosen === 'end') {
        break;
    }
    if (!fs.existsSync(pathChosen)) {
        console.log("File not found.");
        continue;
    }
    console.log("---------------------------------------");
    console.log("            Add A NEW JOKE");
    console.log("         or type \"0\" to exit");
    console.log("---------------------------------------");
    var input = prompt('Enter your joke: ');
    if (input != '0') {
        try {
            if (pathChosen === process.env.CSV_PATH) {
                addJokeCSV(pathChosen, input);
            }
            else {
                addJokeJSON(pathChosen, input);
            }
        }
        catch (err) {
            console.error("Error writing file: " + err.message);
        }
    }
    else {
        console.log('Exiting the program...');
        break;
    }
}
