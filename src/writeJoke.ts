import * as fs from 'fs';
import * as dotenv from 'dotenv';

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

function fileSelection(): string{
  const prompt = getPrompt();
  console.log("---------------------------------------");
  console.log("This is a program that makes you write");
  console.log("a joke.");
  console.log("\nChoose the type of file you want:");
  console.log("- Type 1 for csv\n- Type 2 for json\n- Type anything else to exit.");
  console.log("---------------------------------------");
  const choice: string = prompt('Enter a number: ');
  return isCSVorJSON(choice);
}

function addJokeCSV(filePath: string, input: string){
  const data = fs.readFileSync(filePath, 'utf8');
  const rows = data.split('\n');
  const lastRow = rows[rows.length-1]?.split(',');
  const lastId = parseInt(lastRow[0]);
  const newId = lastId + 1;
  const safeInput = input.replace(/"/g, '""'); 
  const newJoke: string = `\n${newId},"${safeInput}"`;

  fs.appendFileSync(filePath, newJoke);
  console.log("\n***************************************");
  console.log(`Joke no.${newId} added successfully!`);
  console.log("***************************************");
}

function addJokeJSON(filePath: string, input: string){
  const data = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(data);

  let newId = 1;
  if(json.length > 0){
    const lastItem = json[json.length-1];
    const lastId = Number(lastItem.id);
    if (!isNaN(lastId)){
      newId=lastId+1;
    }
  }

  json.push({ id: newId, joke: input });

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

  console.log("\n***************************************");
  console.log(`Joke no.${newId} added successfully!`);
  console.log("***************************************");  
}

export function writeJokeProgram(){
  while (true) {
    const prompt = getPrompt();
    const pathChosen = fileSelection();

    if (pathChosen === 'end'){
      break;
    }

    if (!fs.existsSync(pathChosen)){
      console.log("File not found.");
      continue;
    }
    
    console.log("---------------------------------------");
    console.log(`            Add A NEW JOKE`);
    console.log(`         or type "0" to exit`);
    console.log("---------------------------------------");
    const input: string = prompt('Enter your joke: ');

    if(input != '0'){
      try {
        if (pathChosen === process.env.CSV_PATH){
          addJokeCSV(pathChosen, input);
        } else {
          addJokeJSON(pathChosen, input);
        }
      } catch (err: any) {
        console.error("Error writing file: " + err.message);
      }
    } else {
      console.log('Exiting the program...')
      break;
    }
  }
}

if (require.main === module && process.env.VITEST !== 'true') {
  jokeProgram();
}