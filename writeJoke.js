"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var filePath = './csv/joke.csv';
fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
        console.error('Error reading the file: ' + err.message);
        return;
    }
    var promptSync = require('prompt-sync')();
    var rows = data.split('\n');
    var csvArray = rows.map(function (row) { return row.split(','); });
    while (true) {
        var lastRow = csvArray[csvArray.length - 1];
        var lastId = parseInt(lastRow[0]);
        var newId = lastId + 1;
        console.log("---------------------------------------");
        console.log("            Add A NEW JOKE");
        console.log("         or type \"0\" to exit");
        console.log("---------------------------------------");
        var input = promptSync('Enter your joke: ');
        var safeInput = input.replace(/"/g, '""');
        var newJoke = "\n".concat(newId, ",\"").concat(safeInput, "\"");
        if (input != '0') {
            try {
                fs.appendFileSync(filePath, newJoke);
                console.log("\n***************************************");
                console.log("Joke no.".concat(newId, " added successfully!"));
                console.log("***************************************");
            }
            catch (err) {
                console.error("Error writing file: " + err.message);
            }
            csvArray.push([newId.toString(), input]);
        }
        else {
            console.log('Exiting the program...');
            break;
        }
    }
});
