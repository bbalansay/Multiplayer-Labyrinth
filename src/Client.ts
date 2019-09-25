import WebSocket from 'ws';
import { Command, CommandParser } from './Parser';

//connect to the server
const connection = new WebSocket(`ws://localhost:8080`);
let parserActive: boolean;

const parser = new CommandParser((cmd:Command, arg:string) => {
  arg = arg.toUpperCase()

  connection.send(JSON.stringify({
    'cmd': cmd,
    'arg': arg
  }))

  return cmd !== Command.QUIT;
}, false);

connection.on('message', (message: string) => {
  try {
    let json = JSON.parse(message);
  
    if(json['event'] === 'connection') {
      console.log(`You are Player ${json['data']}.`);
      parserActive = json['active'];
    } 
    else if(json['event'] === 'response') {
      console.log(json['data']);

      if(parserActive)
        parserActive = json['active'];
    }
  }
  catch(err) {
    console.log(err);
  }

  if(parserActive)
    parser.prompt();
  else
    parser.close();
})