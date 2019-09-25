"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monster {
    constructor(name, description, playerWins, monsterWins, weakness) {
        this.name = name;
        this.description = description;
        this.descWhenPlayerWins = playerWins;
        this.descWhenMonsterWins = monsterWins;
        this.weakness = weakness;
    }
    getWeakness() {
        return this.weakness;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    monsterDefeated() {
        return this.descWhenPlayerWins;
    }
    playerDefeated() {
        return this.descWhenMonsterWins;
    }
}
exports.Monster = Monster;
//# sourceMappingURL=Monster.js.map