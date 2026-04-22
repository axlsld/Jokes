import * as net from 'net';

const client = net.createConnection({ port: 8080, host: '192.168.0.114' }, () => {
  console.log('Connected to the Joke Server!');
});

client.on('data', (data: any) => {
  process.stdout.write(data.toString());
});

process.stdin.on('data', (data: any) => {
  client.write(data);
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