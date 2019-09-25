"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hazard {
    constructor(name, descPass, descCannot, weakness) {
        this.name = name;
        this.descWhenPlayerCanPass = descPass;
        this.descWhenPlayerCannot = descCannot;
        this.weakness = weakness;
    }
    getWeakness() {
        return this.weakness;
    }
    getName() {
        return this.name;
    }
    playerCanPass() {
        return this.descWhenPlayerCanPass;
    }
    playerCannotPass() {
        return this.descWhenPlayerCannot;
    }
}
exports.Hazard = Hazard;
//# sourceMappingURL=Hazard.js.map