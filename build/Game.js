"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
class Game {
    constructor(labyrinth) {
        this.labyrinth = labyrinth;
    }
    playGame() {
        this.labyrinth.intro();
        let parser = new Parser_1.CommandParser((cmd, arg) => {
            arg = arg.toUpperCase();
            if (cmd === Parser_1.Command.GO) {
                this.labyrinth.movePlayer(arg);
            }
            else if (cmd === Parser_1.Command.LOOK) {
                this.labyrinth.getLocationDescription();
            }
            else if (cmd === Parser_1.Command.TAKE) {
                this.labyrinth.takeItem(arg);
            }
            else if (cmd === Parser_1.Command.USE) {
                this.labyrinth.useItem(arg);
            }
            else if (cmd === Parser_1.Command.INVENTORY) {
                this.labyrinth.checkInventory();
            }
            return this.labyrinth.getGameStatus();
        });
        parser.start();
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map