import * as fs from 'fs';
import * as promptSync from 'prompt-sync';
import { parse } from 'csv-parse/sync';


const prompt = require('prompt-sync')();

while(true){
  const data = fs.readFileSync('./csv/joke.csv', 'utf8');
  const csvArray = parse(data, {columns: false, skip_empty_lines: true, relax_quotes: true, relax_column_count: true});
  console.log("---------------------------------------");
  console.log(`TYPE A NUMBER FROM 1 TO ${csvArray.length-1} TO GET A JOKE`);
  console.log(`         or type "0" to exit`);
  console.log("---------------------------------------");
  const input: string = prompt('Enter a number: ');
  console.log("---------------------------------------"); 
  const id: number = parseInt(input);
  if(input == '0'){
    console.log('Exiting the program...')
    break;
  }
  if ((id > 0 && id < csvArray.length) && Number.isInteger(Number(input))) {
    console.log(csvArray[id][1]);
  } else {
    console.log('Invalid input or joke not found');
  }
}
