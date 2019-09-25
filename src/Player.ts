import { Overcomeable } from './Overcomeable';
import { Item } from './Item';

export class Player {
  private inventory: Item[];
  private usedItems: Item[];

  constructor() {
    this.inventory = [];
    this.usedItems = [];
  }

  takeItem(item: Item): boolean {
    let found: boolean = false;

    this.inventory.forEach((value) => {
      if(item.getName() === value.getName())
        found = true;
    })

    this.usedItems.forEach((value) => {
      if(item.getName() === value.getName())
        found = true;
    })

    if(!found) {
      this.inventory.push(item);
      return true
    } else {
      return false
    }
  }

  useItem(name: string): string {
    let response = ``;
    let foundItem = this.getItem(name);

    if (foundItem !== undefined) {
      this.usedItems.push(foundItem);
      response += foundItem.getActiveDescription();
    
      this.inventory = this.inventory.filter((value) => {
        return value !== foundItem
      });
    } else {
      response += `You cannot use an item you do not have.`
    }

    return response;
  }

  listInventory(): string {
    if (this.inventory.length > 0 || this.usedItems.length > 0) {
      let response = `Unused Items:`

      this.inventory.forEach((value) => {
        response += `
  - ${value.getName()}`
      });

      response += `
      
Used Items:`

      this.usedItems.forEach((value) => {
        response += `
  - ${value.getName()}`
      })

      return response;
    } else {
      return "Oops! You have no items.";
    }
  }

  isInventoryEmpty(): boolean {
    return this.inventory.length === 0
  }

  hasItem(name: string): boolean {
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

  private getItem(name: string): Item | undefined {
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

  hasUsedItem(item: Item): boolean {
    return this.usedItems.includes(item);
  }

  didPlayerOvercome(overcomeable: Overcomeable): boolean {
    return this.hasUsedItem(overcomeable.getWeakness())
  }

  dropItem(itemName: string): Item | undefined {
    let found: Item | undefined = undefined;

    this.inventory.forEach((item) => {
      if(item.getName() === itemName)
        found = item;
    })

    if(found !== undefined) {
      this.inventory = this.inventory.filter((value) => {
        return value !== found
      });
    } else {
      this.usedItems.forEach((item) => {
        if(item.getName() === itemName)
          found = item;
      })

      if(found !== undefined) {
        this.usedItems = this.usedItems.filter((value) => {
          return value !== found
        });
      }
    }

    return found;
  }

  dropAllItems(): Item[] {
    return this.inventory.concat(this.usedItems);
  }
}
