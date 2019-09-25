"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Parser_1 = require("./Parser");
//connect to the server
const connection = new ws_1.default(`ws://localhost:8080`);
let parserActive;
const parser = new Parser_1.CommandParser((cmd, arg) => {
    arg = arg.toUpperCase();
    connection.send(JSON.stringify({
        'cmd': cmd,
        'arg': arg
    }));
    return cmd !== Parser_1.Command.QUIT;
}, false);
connection.on('message', (message) => {
    try {
        let json = JSON.parse(message);
        if (json['event'] === 'connection') {
            console.log(`You are Player ${json['data']}.`);
            parserActive = json['active'];
        }
        else if (json['event'] === 'response') {
            console.log(json['data']);
            if (parserActive)
                parserActive = json['active'];
        }
    }
    catch (err) {
        console.log(err);
    }
    if (parserActive)
        parser.prompt();
    else
        parser.close();
});
//# sourceMappingURL=Client.js.map