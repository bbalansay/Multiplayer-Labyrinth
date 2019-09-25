"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor() {
        this.inventory = [];
        this.usedItems = [];
    }
    takeItem(item) {
        let found = false;
        this.inventory.forEach((value) => {
            if (item.getName() === value.getName())
                found = true;
        });
        this.usedItems.forEach((value) => {
            if (item.getName() === value.getName())
                found = true;
        });
        if (!found) {
            this.inventory.push(item);
            return true;
        }
        else {
            return false;
        }
    }
    useItem(name) {
        let response = ``;
        let foundItem = this.getItem(name);
        if (foundItem !== undefined) {
            this.usedItems.push(foundItem);
            response += foundItem.getActiveDescription();
            this.inventory = this.inventory.filter((value) => {
                return value !== foundItem;
            });
        }
        else {
            response += `You cannot use an item you do not have.`;
        }
        return response;
    }
    listInventory() {
        if (this.inventory.length > 0 || this.usedItems.length > 0) {
            let response = `Unused Items:`;
            this.inventory.forEach((value) => {
                response += `
  - ${value.getName()}`;
            });
            response += `
      
Used Items:`;
            this.usedItems.forEach((value) => {
                response += `
  - ${value.getName()}`;
            });
            return response;
        }
        else {
            return "Oops! You have no items.";
        }
    }
    isInventoryEmpty() {
        return this.inventory.length === 0;
    }
    hasItem(name) {
        let found = false;
        if (this.inventory.length > 0) {
            this.inventory.forEach((value) => {
                if (value.getName() === name) {
                    found = true;
                }
            });
        }
        return found;
    }
    getItem(name) {
        let found = undefined;
        if (this.inventory.length > 0) {
            this.inventory.forEach((value) => {
                if (value.getName() === name) {
                    found = value;
                }
            });
        }
        return found;
    }
    hasUsedItem(item) {
        return this.usedItems.includes(item);
    }
    didPlayerOvercome(overcomeable) {
        return this.hasUsedItem(overcomeable.getWeakness());
    }
    dropItem(itemName) {
        let found = undefined;
        this.inventory.forEach((item) => {
            if (item.getName() === itemName)
                found = item;
        });
        if (found !== undefined) {
            this.inventory = this.inventory.filter((value) => {
                return value !== found;
            });
        }
        else {
            this.usedItems.forEach((item) => {
                if (item.getName() === itemName)
                    found = item;
            });
            if (found !== undefined) {
                this.usedItems = this.usedItems.filter((value) => {
                    return value !== found;
                });
            }
        }
        return found;
    }
    dropAllItems() {
        return this.inventory.concat(this.usedItems);
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map