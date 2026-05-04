Joke.ts is where you can input a number to read a joke from the csv file.
writeJoke.ts is where you can write a joke to insert in the csv file.
jokes-server.ts will act as a server and jokes-client.ts will act as a client

.env is ignored so replace the placeholders on .env.example file with their real value.

HOW TO USE THE CLIENT-SERVER PROGRAM:
1. run npx ts-node jokes-server.ts to start the server
2. modify the ip address and port in the .env file
3. run ncat <IPADDRESS> <PORT> on a separate terminal
4. type the buttons CTRL+C to end the program