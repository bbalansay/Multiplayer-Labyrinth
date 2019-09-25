import { Overcomeable } from './Overcomeable';
import { Item } from './Item';

export class Monster implements Overcomeable {
  private name: string;
  private description: string;
  private descWhenPlayerWins: string;
  private descWhenMonsterWins: string;
  private weakness: Item;

  constructor(name: string, description: string, playerWins: string, monsterWins: string, weakness: Item) {
    this.name = name;
    this.description = description;
    this.descWhenPlayerWins = playerWins;
    this.descWhenMonsterWins = monsterWins;
    this.weakness = weakness;
  }

  getWeakness(): Item {
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