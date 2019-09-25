"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Item {
    constructor(name, passive, active) {
        this.name = name;
        this.passiveDescription = passive;
        this.activeDescription = active;
    }
    getName() {
        return this.name;
    }
    getPassiveDescription() {
        return this.passiveDescription;
    }
    getActiveDescription() {
        return this.activeDescription;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map