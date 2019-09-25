"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = require("./Item");
const Player_1 = require("./Player");
const Monster_1 = require("./Monster");
const Location_1 = require("./Location");
const Hazard_1 = require("./Hazard");
const Labyrinth_1 = require("./Labyrinth");
const Game_1 = require("./Game");
const data = require('../data/data.json');
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
        locations[location["name"]] = new Location_1.Location(location["name"], location["desc"], items[location["item"]], hazards[location["hazard"]]);
    });
    data["Locations"].forEach((location) => {
        locations[location["name"]].setLocationInDirection("NORTH", locations[location["north"]]);
        locations[location["name"]].setLocationInDirection("SOUTH", locations[location["south"]]);
        locations[location["name"]].setLocationInDirection("EAST", locations[location["east"]]);
        locations[location["name"]].setLocationInDirection("WEST", locations[location["west"]]);
    });
    let player = new Player_1.Player();
    let monsterData = data["Monster"];
    let monster = new Monster_1.Monster(monsterData["name"], monsterData["desc"], monsterData["playerWin"], monsterData["monsterWin"], items[monsterData["weakness"]]);
    let treasure = items[data["treasure"]];
    let playerStart = locations[data["playerStart"]];
    let monsterStart = locations[data["monsterStart"]];
    let goal = locations[data["goal"]];
    return new Labyrinth_1.Labyrinth(player, monster, treasure, playerStart, monsterStart, goal);
}
let laby = readLabyrinthFromJSON(data);
let game = new Game_1.Game(laby);
game.playGame();
//# sourceMappingURL=app.js.map