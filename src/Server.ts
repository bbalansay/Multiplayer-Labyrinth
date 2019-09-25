import WebSocket from 'ws';
import { Command } from './Parser';
import { Item } from './Item';
import { Player } from './Player';
import { Monster } from './Monster';
import { Location } from './Location';
import { Hazard } from './Hazard';
import { Labyrinth } from './Labyrinth';

const data = require('../data/data.json')
const PORT = 8080;

//The server initiates listening once instantiated
const server = new WebSocket.Server({port: PORT});
console.log(`Started new WebSocket server on ${PORT}`)

let connections: WebSocket[] = []
let laby = readLabyrinthFromJSON(data);

//when receiving a connection from a client
server.on('connection', (client) => {
  connections.push(client)
  
  let player = new Player();
  let playerID = connections.indexOf(client);
  laby.addPlayer(player)
  console.log(`Player ${playerID} has joined the server!`)

  echoToClient(client, 'connection', `${playerID}`, true);
  echoToClient(client, 'response', laby.intro(player), true);
  echoToOthers(client, 'response', `Player ${playerID} has joined the server!`, true);
  

  //event handler for ALL messages (from that client)
  client.on('message', (message: string) => {
    let json = JSON.parse(message);
    let cmd = json['cmd'];
    let arg = json['arg'];

    if (cmd === Command.GO) { 
      echoToClient(client, 'response', laby.movePlayer(player, arg), true)
    } else if (cmd === Command.LOOK) {
      echoToClient(client, 'response', laby.getLocationDescription(player), true)
    } else if (cmd === Command.TAKE) {
      let response = laby.takeItem(player, arg);
      echoToClient(client, 'response', response, true)

      if(response.indexOf("You take the ") !== -1) {
        echoToOthers(client, 'response', `Player ${playerID} took the ${arg}.`, true)
      }
    } else if (cmd === Command.DROP) {
      let response = laby.dropItem(player, arg)
      echoToClient(client, 'response', response, true)

      if(response.indexOf("You dropped the ") !== -1) {
        echoToOthers(client, 'response', `Player ${playerID} dropped the ${arg}.`, true)
      }
    } else if (cmd === Command.USE) {
      let response = laby.useItem(player, arg);
      let status = laby.getPlayerStatus(player);

      if(response.indexOf("You win!") !== -1) {
        echoToClient(client, 'response', response, false)
        echoToOthers(client, 'response', `Game Over! Player ${playerID} wins!`, false)
        server.close()
      } else {
        echoToClient(client, 'response', response, status)
      }
    } else if (cmd === Command.INVENTORY) {
      echoToClient(client, 'response', laby.checkInventory(player), true)
    } 
    
    if(cmd === Command.QUIT) {
      console.log(`Player ${playerID} has left the server.`)
      
      echoToClient(client, 'response', 'You have left the server.', false)
      client.close();
      laby.dropAllItems(player)
      echoToOthers(client, 'response', `Player ${playerID} has left the server and abandoned all their items.`, true)
    } else if(!laby.getPlayerStatus(player)) {
      echoToClient(client, 'response', 'Game over!', false)
      client.close()
      laby.dropAllItems(player)
      echoToOthers(client, 'response', `Player ${playerID} has been defeated! Any items they held have been dropped.`, true)
    }
  });
});

const echoToClient = (client: WebSocket, event: string, data: string, active: boolean) => {
  client.send(JSON.stringify({
    'event': event,
    'data': data,
    'active': active
  })); 
}

const echoToOthers = (client: WebSocket, event: string, data: string, active: boolean) => {
  connections.forEach((connection) => {
    if(connection !== client) {
      connection.send(JSON.stringify({
        'event': event,
        'data': `\n${data}`,
        'active': active
      })); 
    }
  })
}

function readLabyrinthFromJSON(data: any): Labyrinth {
  let items: any = {}
  let hazards: any = {}
  let locations: any = {}

  data["Items"].forEach((item: any) => {
    items[item["name"]] = new Item(item["name"], item["passive"], item["active"])
  });

  data["Hazards"].forEach((hazard: any) => {
    hazards[hazard["name"]] = new Hazard(hazard["name"], hazard["canPass"], 
      hazard["cannot"], items[hazard["weakness"]])
  });

  data["Locations"].forEach((location: any) => {
    let locItems: any = [];

    location["items"].forEach((item: any) => {
      locItems.push(items[item])
    })

    locations[location["name"]] = new Location(location["name"], location["desc"], 
      locItems, hazards[location["hazard"]])
  });

  data["Locations"].forEach((location: any) => {
    locations[location["name"]].setLocationInDirection("NORTH", locations[location["north"]])
    locations[location["name"]].setLocationInDirection("SOUTH", locations[location["south"]])
    locations[location["name"]].setLocationInDirection("EAST", locations[location["east"]])
    locations[location["name"]].setLocationInDirection("WEST", locations[location["west"]])
  });

  let monsterData = data["Monster"]; 
  let monster = new Monster(monsterData["name"], monsterData["desc"], monsterData["playerWin"],
    monsterData["monsterWin"], items[monsterData["weakness"]]);

  let treasure = items[data["treasure"]];
  let playerStart = locations[data["playerStart"]];
  let monsterStart = locations[data["monsterStart"]];
  let goal = locations[data["goal"]];

  return new Labyrinth(monster, treasure, playerStart, monsterStart, goal)
}

