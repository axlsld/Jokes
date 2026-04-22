import * as net from 'net';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';
import './env';

dotenv.config();

const PORT = 8080;

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
    console.log('Client exited the program')
    path='end';
  } return path;
}

export function fileSelection(socket: net.Socket){
  socket.write("---------------------------------------\n");
  socket.write("This is a program that gives you a joke\n");
  socket.write("based on the number you will input.\n");
  socket.write("\nChoose the type of file you want:\n");
  socket.write("- Type 1 for csv\n- Type 2 for json\n- Type anything else to exit.\n");
  socket.write("---------------------------------------\n");
  socket.write('Enter a number: ');
}

export function validateAndExecuteJokeSelection(socket: net.Socket, input: string, jokes: [number, string][]): boolean {
  const id: number = parseInt(input);
  let checker: boolean = false;

  if(input == '0'){
    return false;
  }

  if ((id > 0 && id < jokes.length) && Number.isInteger(Number(input))) {
    socket.write(`${jokes[id]![1]}\n`);
    checker = true;
  } else {
    socket.write('Invalid input or joke not found\n');
  }
return checker;
}

function jokeSelection(socket: net.Socket, jokes: [number, string][]){
  // while (true){
    socket.write("---------------------------------------\n");
    socket.write(`TYPE A NUMBER FROM 1 TO ${jokes.length-1} TO GET A JOKE\n`);
    socket.write(`         or type "0" to exit\n`);
    socket.write("---------------------------------------\n");
    // socket.on('data', (data: any) => {
    //   const input: string = data.toString().trim();
    //   const status = validateAndExecuteJokeSelection(socket, input, jokes);
    socket.write("Enter joke number: "); 

    //   if (status === false){
    //     socket.write('Exiting the program...');
    //     return false;
    //   }

    //   if (status === true){
    //     return true;
    //   }
    // });
  // }
}

export function jokeProgram(){
  const server = net.createServer((socket) => {
    console.log('Client connected');

    let state: 'PICK_FILE' | 'PICK_JOKE' = 'PICK_FILE';
    let array: [number, string][];

    fileSelection(socket);

    socket.on('data', (data: any) => {
      const input: string = data.toString().trim();

      if (state === 'PICK_FILE') {
        const pathChosen: string = isCSVorJSON(input);

        if (pathChosen === 'end'){
          socket.write('Exiting the program...\n');
          socket.end();
          return;
        }

        if (!fs.existsSync(pathChosen)){
          console.log("File not found. Try again.\n");
          return;
        }
        
        try{
          const fileData = fs.readFileSync(pathChosen, 'utf8');
          state = 'PICK_JOKE';
          if (pathChosen == process.env.CSV_PATH){
            const parsed: string[][] = parse(fileData, { columns: false, skip_empty_lines: true });
            array = parsed.map((row: any, index: number) => [index + 1, row[1]]); 
            console.log(`Client chose csv file`)
          } else {
            const arrayJSON = JSON.parse(fileData);
            array = arrayJSON.map((obj: any, index: any) => [index+1, obj.joke]);
            console.log(`Client chose json file`)
          }
      
          jokeSelection(socket, array);
        } catch (err) {
          socket.write("Error reading file. Exiting...\n");
          socket.end();
        }
      } else if (state === 'PICK_JOKE') {
        const continueProgram = validateAndExecuteJokeSelection(socket, input, array);
        if(!continueProgram) {
          socket.write('Exiting the program...\n');
          socket.end();
        } else {
          state = 'PICK_FILE';
          fileSelection(socket);
        }
      }
    });
    
    socket.on('error', (err:any) => {
      console.log('Error: ', err.message);
    });
  });
  
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

if (require.main === module && process.env.VITEST !== 'true') {
  jokeProgram();
}
