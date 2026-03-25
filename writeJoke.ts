import * as fs from 'fs';
import * as promptSync from 'prompt-sync';

const filePath = './csv/joke.csv';
fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
  if (err) {
    console.error('Error reading the file: ' + err.message);
    return;
  }
  const promptSync = require('prompt-sync')();

  const rows = data.split('\n');
  const csvArray = rows.map(row => row.split(','));

  while (true) {
    const lastRow = csvArray[csvArray.length-1];
    const lastId = parseInt(lastRow[0]);
    const newId = lastId + 1;
    
    console.log("---------------------------------------");
    console.log(`            Add A NEW JOKE`);
    console.log(`         or type "0" to exit`);
    console.log("---------------------------------------");
    const input: string = promptSync('Enter your joke: ');
    const safeInput = input.replace(/"/g, '""'); 
    const newJoke: string = `\n${newId},"${safeInput}"`;

    if(input != '0'){
      try {
        fs.appendFileSync(filePath, newJoke);
        console.log("\n***************************************");
        console.log(`Joke no.${newId} added successfully!`);
        console.log("***************************************");
      } catch (err: any) {
        console.error("Error writing file: " + err.message);
      } csvArray.push([newId.toString(),input]);
    } else {
      console.log('Exiting the program...')
      break;
    }
  }
});
