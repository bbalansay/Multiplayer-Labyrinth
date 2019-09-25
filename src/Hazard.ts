import { Overcomeable } from './Overcomeable';
import { Item } from './Item';

export class Hazard implements Overcomeable {
  private name: string;
  private descWhenPlayerCanPass: string;
  private descWhenPlayerCannot: string;
  private weakness: Item;

  constructor(name: string, descPass: string, descCannot: string, weakness: Item) {
    this.name = name;
    this.descWhenPlayerCanPass = descPass;
    this.descWhenPlayerCannot = descCannot;
    this.weakness = weakness;
  }

  getWeakness(): Item {
    return this.weakness;
  }

  getName() {
    return this.name;
  }

  playerCanPass(): string {
    return this.descWhenPlayerCanPass;
  }

  playerCannotPass(): string {
    return this.descWhenPlayerCannot;
  }
}