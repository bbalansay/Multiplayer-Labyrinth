"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Labyrinth {
    constructor(monster, treasure, playerStart, monsterStart, goalLocation) {
        this.players = [];
        this.playerStatus = [];
        this.monster = monster;
        this.treasure = treasure;
        this.playerStartLocation = playerStart;
        this.playerLocations = [];
        this.monsterLocation = monsterStart;
        this.goalLocation = goalLocation;
        this.monsterIsAlive = true;
        this.gameIsActive = true;
    }
    addPlayer(player) {
        this.players.push(player);
        this.playerLocations.push(this.playerStartLocation);
        this.playerStatus.push(true);
    }
    getPlayerLocation(player) {
        let idx = this.players.indexOf(player);
        return this.playerLocations[idx];
    }
    setPlayerLocation(player, location) {
        let idx = this.players.indexOf(player);
        this.playerLocations[idx] = location;
    }
    getPlayerStatus(player) {
        let idx = this.players.indexOf(player);
        return this.playerStatus[idx];
    }
    setPlayerStatus(player, status) {
        let idx = this.players.indexOf(player);
        this.playerStatus[idx] = status;
    }
    playerIsInDanger(player) {
        let playerLoc = this.getPlayerLocation(player);
        if (playerLoc === this.monsterLocation && this.monsterIsAlive)
            return true;
        return false;
    }
    intro(player) {
        return `WELCOME TO THE LABYRINTH!
You're stuck on the UW campus and need to get home on the lightrail.
Find your way back without running into anyone unpleasant` + this.arriveNewLocation(player);
    }
    arriveNewLocation(player) {
        let playerLoc = this.getPlayerLocation(player);
        return `
${playerLoc.getName()}
${this.getLocationDescription(player)}
What would you like to do?`;
    }
    getLocationDescription(player) {
        let playerLoc = this.getPlayerLocation(player);
        if (this.playerIsInDanger(player)) {
            return `Focus on the fight!`;
        }
        else {
            return `${playerLoc.getDescription()}`;
        }
    }
    // Monster moves upon successful player move
    movePlayer(player, direction) {
        let response = ``;
        if (!this.playerIsInDanger(player)) {
            let playerLoc = this.getPlayerLocation(player);
            let newLocation = playerLoc.getLocationInDirection(direction, player);
            if (typeof newLocation !== "string") {
                response += newLocation.passHazard(player);
                this.setPlayerLocation(player, newLocation);
                if (this.monsterIsAlive && this.playerIsInDanger(player)) {
                    response += `${this.bossBattleDialogue(player)}
It is time to fight!`;
                }
                else {
                    response += this.arriveNewLocation(player);
                }
            }
            else {
                response += newLocation;
            }
        }
        else {
            response += `It is time to fight!`;
        }
        return response;
    }
    // Monster is static for purposes of testing
    // Monsters should be implemented with random movements
    // Do not move if in the same area as player
    // If you run into player, flag danger
    moveMonster(player) {
        return ``;
    }
    bossBattleDialogue(player) {
        let response = `
${this.monster.getDescription()}`;
        if (player.hasUsedItem(this.monster.getWeakness())) {
            response += `
You already used the item ${this.monster.getWeakness().getName()} needed to defeat ${this.monster.getName()}!
${this.monster.playerDefeated()}`;
            this.setPlayerStatus(player, false);
        }
        return response;
    }
    didBeatBoss(player, itemName) {
        let response = ``;
        if (!player.hasUsedItem(this.monster.getWeakness())) {
            player.useItem(itemName);
            let overcame = player.didPlayerOvercome(this.monster);
            if (overcame) {
                this.monsterIsAlive = false;
                response += `
${this.monster.monsterDefeated()}
${this.arriveNewLocation(player)}`;
            }
            else {
                this.setPlayerStatus(player, false);
                response += `You needed to use ${this.monster.getWeakness().getName()} to defeat ${this.monster.getName()}!
${this.monster.playerDefeated()}`;
            }
        }
        else {
            this.setPlayerStatus(player, false);
            response += `You needed to use ${this.monster.getWeakness().getName()} to defeat ${this.monster.getName()}!
${this.monster.playerDefeated()}`;
        }
        return response;
    }
    checkIfGameOver(player) {
        let playerLoc = this.getPlayerLocation(player);
        if (playerLoc === this.goalLocation && this.gameIsActive && !this.playerIsInDanger(player)) {
            this.gameIsActive = false;
            return "You win!";
        }
        else {
            player.useItem(this.treasure.getName());
            this.setPlayerStatus(player, false);
            return "You lose! You needed that!";
        }
    }
    getGameStatus() {
        return this.gameIsActive;
    }
    checkInventory(player) {
        return player.listInventory();
    }
    takeItem(player, itemName) {
        if (this.playerIsInDanger(player)) {
            return `No time to grab things! Time to fight!`;
        }
        else {
            let playerLoc = this.getPlayerLocation(player);
            let item = playerLoc.getItem(itemName);
            if (item !== undefined) {
                if (player.takeItem(item))
                    return `You take the ${item.getName()}.`;
                else
                    playerLoc.setItem(item);
                return `You don't need another ${item.getName()}!`;
            }
            else {
                return `No item by that name here!`;
            }
        }
    }
    useItem(player, itemName) {
        if (itemName === this.treasure.getName() && player.hasItem(this.treasure.getName())) {
            return this.checkIfGameOver(player);
        }
        else {
            if (this.playerIsInDanger(player)) {
                return this.didBeatBoss(player, itemName);
            }
            else {
                return player.useItem(itemName);
            }
        }
    }
    dropItem(player, itemName) {
        if (this.playerIsInDanger(player)) {
            return `It's not the time to drop things! It's time to fight!`;
        }
        else {
            let playerLoc = this.getPlayerLocation(player);
            let item = player.dropItem(itemName);
            if (item !== undefined) {
                playerLoc.setItem(item);
                return `You dropped the ${itemName}`;
            }
            else {
                return `You don't have that item.`;
            }
        }
    }
    dropAllItems(player) {
        let playerLoc = this.getPlayerLocation(player);
        let items = player.dropAllItems();
        items.forEach((item) => {
            playerLoc.setItem(item);
        });
    }
}
exports.Labyrinth = Labyrinth;
//# sourceMappingURL=Labyrinth.js.map