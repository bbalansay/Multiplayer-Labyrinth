"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Location {
    constructor(name, desc, items = [], hazard, north, south, east, west) {
        this.name = name;
        this.description = desc;
        this.items = items;
        this.hazard = hazard;
        this.toNorth = north;
        this.toSouth = south;
        this.toEast = east;
        this.toWest = west;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        let response = `${this.description}`;
        this.items.forEach((item) => {
            response += `
${item.getPassiveDescription()}`;
        });
        return response;
    }
    hasItem(name) {
        let hasItem = false;
        this.items.forEach((item) => {
            if (item.getName() === name)
                hasItem = true;
        });
        return hasItem;
    }
    getItem(name) {
        if (this.hasItem(name)) {
            let removed = false;
            let itemToTake = this.items.filter(item => item.getName() === name);
            this.items = this.items.filter(item => {
                if (item === itemToTake[0] && removed === false) {
                    removed = true;
                    return false;
                }
                else {
                    return true;
                }
            });
            return itemToTake[0];
        }
        return undefined;
    }
    setItem(item) {
        this.items.push(item);
    }
    setHazard(hazard) {
        this.hazard = hazard;
    }
    hasHazard() {
        if (this.hazard === undefined) {
            return false;
        }
        return true;
    }
    playerCanGoHere(player) {
        if (this.hazard === undefined) {
            return true;
        }
        if (player.didPlayerOvercome(this.hazard)) {
            return true;
        }
        else {
            return false;
        }
    }
    passHazard(player) {
        if (this.hazard === undefined) {
            return ``;
        }
        if (player.didPlayerOvercome(this.hazard)) {
            return this.hazard.playerCanPass();
        }
        else {
            return this.hazard.playerCannotPass();
        }
    }
    getLocationInDirection(direction, player) {
        if (direction === "NORTH") {
            if (this.toNorth === undefined) {
                return "Nothing to see here!";
            }
            else if (player !== undefined && !this.toNorth.playerCanGoHere(player)) {
                return this.toNorth.passHazard(player);
            }
            else {
                return this.toNorth;
            }
        }
        else if (direction === "SOUTH") {
            if (this.toSouth === undefined) {
                return "Nothing to see here!";
            }
            else if (player !== undefined && !this.toSouth.playerCanGoHere(player)) {
                return this.toSouth.passHazard(player);
            }
            else {
                return this.toSouth;
            }
        }
        else if (direction === "EAST") {
            if (this.toEast === undefined) {
                return "Nothing to see here!";
            }
            else if (player !== undefined && !this.toEast.playerCanGoHere(player)) {
                return this.toEast.passHazard(player);
            }
            else {
                return this.toEast;
            }
        }
        else if (direction === "WEST") {
            if (this.toWest === undefined) {
                return "Nothing to see here!";
            }
            else if (player !== undefined && !this.toWest.playerCanGoHere(player)) {
                return this.toWest.passHazard(player);
            }
            else {
                return this.toWest;
            }
        }
        else {
            return "Nothing to see here!";
        }
    }
    setLocationInDirection(direction, location) {
        if (direction === "NORTH") {
            this.toNorth = location;
        }
        else if (direction === "SOUTH") {
            this.toSouth = location;
        }
        else if (direction === "EAST") {
            this.toEast = location;
        }
        else if (direction === "WEST") {
            this.toWest = location;
        }
    }
}
exports.Location = Location;
//# sourceMappingURL=Location.js.map