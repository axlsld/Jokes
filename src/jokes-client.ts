import * as net from 'net';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT);
const HOST = process.env.IPADDRESS;

const client = net.createConnection( PORT, HOST , () => {
  console.log('Connected to the Joke Server!');
});

client.on('data', (data: any) => {
  const rawData = data.toString();

  try {
    const json = JSON.parse(rawData);

    if (json.joke){
      console.log(`\n JOKE: ${json.joke}\n`);
    } else if (json.message) {
      process.stdout.write(json.message);
    } else {
      console.log(json);
    }
  } catch (e) {
    process.stdout.write(rawData);
  }
});

process.stdin.on('data', (data: any) => {
  const input = data.toString().trim();

  const jsonData = JSON.stringify({ input: input});
  client.write(jsonData);
});

client.on('end', () => {
  console.log('Disconnected from the Joke Server');
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err:any) => {
  console.log('Error: ', err.message);
});