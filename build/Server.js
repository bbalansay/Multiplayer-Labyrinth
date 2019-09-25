"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Parser_1 = require("./Parser");
const Item_1 = require("./Item");
const Player_1 = require("./Player");
const Monster_1 = require("./Monster");
const Location_1 = require("./Location");
const Hazard_1 = require("./Hazard");
const Labyrinth_1 = require("./Labyrinth");
const data = require('../data/data.json');
const PORT = 8080;
//The server initiates listening once instantiated
const server = new ws_1.default.Server({ port: PORT });
console.log(`Started new WebSocket server on ${PORT}`);
let connections = [];
let laby = readLabyrinthFromJSON(data);
//when receiving a connection from a client
server.on('connection', (client) => {
    connections.push(client);
    let player = new Player_1.Player();
    let playerID = connections.indexOf(client);
    laby.addPlayer(player);
    console.log(`Player ${playerID} has joined the server!`);
    echoToClient(client, 'connection', `${playerID}`, true);
    echoToClient(client, 'response', laby.intro(player), true);
    echoToOthers(client, 'response', `Player ${playerID} has joined the server!`, true);
    //event handler for ALL messages (from that client)
    client.on('message', (message) => {
        let json = JSON.parse(message);
        let cmd = json['cmd'];
        let arg = json['arg'];
        if (cmd === Parser_1.Command.GO) {
            echoToClient(client, 'response', laby.movePlayer(player, arg), true);
        }
        else if (cmd === Parser_1.Command.LOOK) {
            echoToClient(client, 'response', laby.getLocationDescription(player), true);
        }
        else if (cmd === Parser_1.Command.TAKE) {
            let response = laby.takeItem(player, arg);
            echoToClient(client, 'response', response, true);
            if (response.indexOf("You take the ") !== -1) {
                echoToOthers(client, 'response', `Player ${playerID} took the ${arg}.`, true);
            }
        }
        else if (cmd === Parser_1.Command.DROP) {
            let response = laby.dropItem(player, arg);
            echoToClient(client, 'response', response, true);
            if (response.indexOf("You dropped the ") !== -1) {
                echoToOthers(client, 'response', `Player ${playerID} dropped the ${arg}.`, true);
            }
        }
        else if (cmd === Parser_1.Command.USE) {
            let response = laby.useItem(player, arg);
            let status = laby.getPlayerStatus(player);
            if (response.indexOf("You win!") !== -1) {
                echoToClient(client, 'response', response, false);
                echoToOthers(client, 'response', `Game Over! Player ${playerID} wins!`, false);
                server.close();
            }
            else {
                echoToClient(client, 'response', response, status);
            }
        }
        else if (cmd === Parser_1.Command.INVENTORY) {
            echoToClient(client, 'response', laby.checkInventory(player), true);
        }
        if (cmd === Parser_1.Command.QUIT) {
            console.log(`Player ${playerID} has left the server.`);
            echoToClient(client, 'response', 'You have left the server.', false);
            client.close();
            laby.dropAllItems(player);
            echoToOthers(client, 'response', `Player ${playerID} has left the server and abandoned all their items.`, true);
        }
        else if (!laby.getPlayerStatus(player)) {
            echoToClient(client, 'response', 'Game over!', false);
            client.close();
            laby.dropAllItems(player);
            echoToOthers(client, 'response', `Player ${playerID} has been defeated! Any items they held have been dropped.`, true);
        }
    });
});
const echoToClient = (client, event, data, active) => {
    client.send(JSON.stringify({
        'event': event,
        'data': data,
        'active': active
    }));
};
const echoToOthers = (client, event, data, active) => {
    connections.forEach((connection) => {
        if (connection !== client) {
            connection.send(JSON.stringify({
                'event': event,
                'data': `\n${data}`,
                'active': active
            }));
        }
    });
};
function readLabyrinthFromJSON(data) {
    let items = {};
    let hazards = {};
    let locations = {};
    data["Items"].forEach((item) => {
        items[item["name"]] = new Item_1.Item(item["name"], item["passive"], item["active"]);
    });
    data["Hazards"].forEach((hazard) => {
        hazards[hazard["name"]] = new Hazard_1.Hazard(hazard["name"], hazard["canPass"], hazard["cannot"], items[hazard["weakness"]]);
    });
    data["Locations"].forEach((location) => {
        let locItems = [];
        location["items"].forEach((item) => {
            locItems.push(items[item]);
        });
        locations[location["name"]] = new Location_1.Location(location["name"], location["desc"], locItems, hazards[location["hazard"]]);
    });
    data["Locations"].forEach((location) => {
        locations[location["name"]].setLocationInDirection("NORTH", locations[location["north"]]);
        locations[location["name"]].setLocationInDirection("SOUTH", locations[location["south"]]);
        locations[location["name"]].setLocationInDirection("EAST", locations[location["east"]]);
        locations[location["name"]].setLocationInDirection("WEST", locations[location["west"]]);
    });
    let monsterData = data["Monster"];
    let monster = new Monster_1.Monster(monsterData["name"], monsterData["desc"], monsterData["playerWin"], monsterData["monsterWin"], items[monsterData["weakness"]]);
    let treasure = items[data["treasure"]];
    let playerStart = locations[data["playerStart"]];
    let monsterStart = locations[data["monsterStart"]];
    let goal = locations[data["goal"]];
    return new Labyrinth_1.Labyrinth(monster, treasure, playerStart, monsterStart, goal);
}
//# sourceMappingURL=Server.js.map