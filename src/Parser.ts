import * as readline from 'readline';

/**
 * An enumerated list of command for a simple adventure game.
 */
export enum Command {
  GO = "GO",
  LOOK = "LOOK",
  TAKE = "TAKE",
  DROP = "DROP",
  USE = "USE",
  INVENTORY = "INVENTORY",
  QUIT = "QUIT"
}

//for easy listing/comparison
const commands = [Command.GO, Command.LOOK, Command.TAKE, Command.DROP, Command.USE, Command.INVENTORY, Command.QUIT];

/**
 * A class for handling input commands for a basic adventure game.
 * Acts as a simple wrapper around Node's `readline` module.
 */
export class CommandParser {
  private io: readline.ReadLine;
  private handler: (cmd: Command, arg: string) => boolean;

  /**
   * @param handler A callback function that should handle the user-provided
   * input. The function will be called with the entered Command and argument.
   * The function should return whether or not the parser should prompt the user
   * for further input.
   */
  constructor(handler: (cmd: Command, arg: string) => boolean, private continuous = true) {
    this.handler = handler;

    this.io = readline.createInterface({ 
      input: process.stdin, 
      output: process.stdout,
      completer: (line: string) => { //adapted from Node docs
        const hits = commands.filter((c) => c.startsWith(line.toUpperCase()));
        return [hits.length ? hits : commands, line];
      }
    });

    this.io.on('line', (line) => {
      let firstSpace = line.indexOf(' ');
      if(firstSpace === -1) firstSpace = line.length;
      let cmd = line.substr(0, firstSpace).toUpperCase().trim();

      /*
      Commented out generic QUIT for more verbose functionality

      if(cmd === Command.QUIT){
        //could add "goodbye" message here
        this.io.close();
      }
      else 
      */
 
      if(Command[cmd]) {
        let arg = line.substr(firstSpace+1).trim();
        let shouldProceed = this.handler(cmd, arg); //call handler function!
        if(shouldProceed){
          if(this.continuous) this.io.prompt(); //wait for user to call prompt again
        } else {
          this.io.close();
        }  
      } 
      else {
        console.log('Invalid command. Commands are:', commands.join(', '));
        this.io.prompt(); //repeats
      }
    })
  }

  /**
   * @param handler See constructor argument.
   */
  public setHandler(handler:(cmd: Command, arg: string)=>boolean) {
    this.handler = handler;
  }

  /**
   * Request new user input (for non-continuous parsing)
   */
  public prompt() {
    this.io.prompt();
  }

  /**
   * Begin requesting and parsing user input.
   */
  public start() {
    this.io.prompt();
  }

  public close() {
    this.io.close();
  }
}
