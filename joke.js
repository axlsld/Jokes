"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var sync_1 = require("csv-parse/sync");
var prompt = require('prompt-sync')();
while (true) {
    var data = fs.readFileSync('./csv/joke.csv', 'utf8');
    var csvArray = (0, sync_1.parse)(data, { columns: false, skip_empty_lines: true, relax_quotes: true, relax_column_count: true });
    console.log("---------------------------------------");
    console.log("TYPE A NUMBER FROM 1 TO ".concat(csvArray.length - 1, " TO GET A JOKE"));
    console.log("         or type \"0\" to exit");
    console.log("---------------------------------------");
    var input = prompt('Enter a number: ');
    console.log("---------------------------------------");
    var id = parseInt(input);
    if (input == '0') {
        console.log('Exiting the program...');
        break;
    }
    if ((id > 0 && id < csvArray.length) && Number.isInteger(Number(input))) {
        console.log(csvArray[id][1]);
    }
    else {
        console.log('Invalid input or joke not found');
    }
}
