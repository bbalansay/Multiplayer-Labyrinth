import { Hazard } from './Hazard';
import { Item } from './Item';
import { Player } from './Player';

export class Location {
  private name: string;
  private description: string;
  private items: Item[];

  private hazard?: Hazard;
  private toNorth?: Location;
  private toSouth?: Location;
  private toEast?: Location;
  private toWest?: Location;

  constructor(name: string, desc: string, items: Item[] = [], hazard?: Hazard,
              north?: Location, south?: Location, east?: Location, west?: Location) {
    this.name = name;
    this.description = desc;
    
    this.items = items;  
    this.hazard = hazard;
    this.toNorth = north;
    this.toSouth = south;
    this.toEast = east;
    this.toWest = west;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    let response = `${this.description}`

    this.items.forEach((item) => {
      response += `
${item.getPassiveDescription()}`
    })

    return response;
  }

  private hasItem(name: string): boolean {
    let hasItem = false;
    
    this.items.forEach((item) => {
      if(item.getName() === name)
        hasItem = true;
    })

    return hasItem;
  }

  getItem(name: string): Item | undefined {
    if (this.hasItem(name)) {
      let removed = false;

      let itemToTake = this.items.filter(item => item.getName() === name)
      this.items = this.items.filter(item => {
        if(item === itemToTake[0] && removed === false) {
          removed = true;
          return false;
        } else {
          return true
        }
      })
      return itemToTake[0];
    }
    
    return undefined;
  }

  setItem(item: Item) {
    this.items.push(item);
  }

  setHazard(hazard: Hazard) {
    this.hazard = hazard;
  }

  hasHazard(): boolean {
    if (this.hazard === undefined) {
      return false;
    }

    return true;
  }

  private playerCanGoHere(player: Player) {
    if (this.hazard === undefined) {
      return true;
    }

    if (player.didPlayerOvercome(this.hazard)) {
      return true;
    } else {
      return false;
    }
  }

  passHazard(player: Player): string {
    if (this.hazard === undefined) {
      return ``;
    }

    if (player.didPlayerOvercome(this.hazard)) {
      return this.hazard.playerCanPass();
    } else {
      return this.hazard.playerCannotPass();
    }
  }

  getLocationInDirection(direction: string, player?: Player): Location | string {
    if (direction === "NORTH") {
      if (this.toNorth === undefined) {
        return "Nothing to see here!";
      } else if (player !== undefined && !this.toNorth.playerCanGoHere(player)) { 
        return this.toNorth.passHazard(player);
      } else {
        return this.toNorth;
      }
    } else if (direction === "SOUTH") {
      if (this.toSouth === undefined) {
        return "Nothing to see here!";
      } else if (player !== undefined && !this.toSouth.playerCanGoHere(player)) {
        return this.toSouth.passHazard(player);
      } else {
        return this.toSouth;
      }
    } else if (direction === "EAST") {
      if (this.toEast === undefined) {
        return "Nothing to see here!";
      } else if (player !== undefined && !this.toEast.playerCanGoHere(player)) {
        return this.toEast.passHazard(player);
      } else {
        return this.toEast;
      }
    } else if (direction === "WEST") {
      if (this.toWest === undefined) {
        return "Nothing to see here!";
      } else if (player !== undefined && !this.toWest.playerCanGoHere(player)) {
        return this.toWest.passHazard(player);
      } else {
        return this.toWest;
      }
    } else {
      return "Nothing to see here!";
    }
  }

  setLocationInDirection(direction: string, location: Location): void {
    if (direction === "NORTH") {
      this.toNorth = location;
    } else if (direction === "SOUTH") {
      this.toSouth = location;
    } else if (direction === "EAST") {
      this.toEast = location;
    } else if (direction === "WEST") {
      this.toWest = location;
    }
  }
}