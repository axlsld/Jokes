import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';
import './env';

dotenv.config();
function getPrompt() {
  if (process.env.VITEST) {
    throw new Error("Prompt used during test import (forbidden)");
  }

  const promptSync = require('prompt-sync')();
  return promptSync;
}

export function isCSVorJSON(choice: string): string{
  let path: string;
  if (choice == '1'){
    if (!process.env.CSV_PATH){
      throw new Error("No CSV_PATH in .env");
    }
    path = process.env.CSV_PATH;
  } else if (choice == '2'){
    if (!process.env.JSON_PATH){
      throw new Error("No JSON_PATH in .env");
    }
    path = process.env.JSON_PATH;
  } else {
    console.log('Exiting the program...')
    path='end';
  } return path;
}

export function fileSelection(): string{
  const prompt = getPrompt();
  console.log("---------------------------------------");
  console.log("This is a program that gives you a joke");
  console.log("based on the number you will input.");
  console.log("\nChoose the type of file you want:");
  console.log("- Type 1 for csv\n- Type 2 for json\n- Type anything else to exit.");
  console.log("---------------------------------------");
  const choice: string = prompt('Enter a number: ');
  return isCSVorJSON(choice);
}

export function validateAndExecuteJokeSelection(input: string, jokes: [number, string][]): boolean {
  const id: number = parseInt(input);
  let checker: boolean = false;

  if(input == '0'){
    return false;
  }

  if ((id > 0 && id < jokes.length) && Number.isInteger(Number(input))) {
    console.log(jokes[id]![1]);
    checker = true;
  } else {
    console.log('Invalid input or joke not found');
  }
return checker;
}

function jokeSelection(jokes: [number, string][]): boolean{
  const prompt = getPrompt();
  while (true){
    console.log("---------------------------------------");
    console.log(`TYPE A NUMBER FROM 1 TO ${jokes.length-1} TO GET A JOKE`);
    console.log(`         or type "0" to exit`);
    console.log("---------------------------------------");
    const input: string = prompt('Enter a number: ');
    console.log("---------------------------------------"); 
    const status = validateAndExecuteJokeSelection(input, jokes);

    if (status === false){
      console.log('Exiting the program...');
      return false;
    }

    if (status === true){
      return true;
    }
  }
}

export function jokeProgram(){
  while(true){
    const pathChosen = fileSelection();

    if (pathChosen === 'end'){
      break;
    }

    if (!fs.existsSync(pathChosen)){
      console.log("File not found.");
      continue;
    }

    let data: string;
    try{
      data = fs.readFileSync(pathChosen, 'utf8');
    } catch (err) {
      console.error("Error reading file: ", err);
      continue;
    }

    let array;

    if (pathChosen == process.env.CSV_PATH){
      array = parse(data, {columns: false, skip_empty_lines: true, relax_quotes: true, relax_column_count: true});
    } else {
      const arrayJSON = JSON.parse(data);
      array = arrayJSON.map((obj: any, index: any) => [index+1, obj.joke]);
    }

    const continueProgram = jokeSelection(array);
    if(!continueProgram) break;
  }
}

if (require.main === module && process.env.VITEST !== 'true') {
  jokeProgram();
}
