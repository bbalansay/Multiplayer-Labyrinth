import { Command, CommandParser } from './Parser';
import { Player } from './Player';
import { Monster } from './Monster';
import { Location } from './Location';
import { Item } from './Item'

export class Labyrinth {
  private players: Player[];
  private playerStatus: boolean[];
  private monster: Monster;
  private treasure: Item;

  private playerStartLocation: Location;
  private playerLocations: Location[];

  private monsterLocation: Location;
  private goalLocation: Location;

  private monsterIsAlive: boolean;
  private gameIsActive: boolean;

  constructor(monster: Monster, treasure: Item, playerStart: Location, 
              monsterStart: Location, goalLocation: Location) {
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

  public addPlayer(player: Player): void {
    this.players.push(player);
    this.playerLocations.push(this.playerStartLocation);
    this.playerStatus.push(true);
  }

  public getPlayerLocation(player: Player): Location {
    let idx = this.players.indexOf(player);
    return this.playerLocations[idx];
  }

  private setPlayerLocation(player: Player, location: Location): void {
    let idx = this.players.indexOf(player);
    this.playerLocations[idx] = location;
  }

  public getPlayerStatus(player: Player): boolean {
    let idx = this.players.indexOf(player);
    return this.playerStatus[idx];
  }

  private setPlayerStatus(player: Player, status: boolean): void {
    let idx = this.players.indexOf(player);
    this.playerStatus[idx] = status;
  }

  private playerIsInDanger(player: Player): boolean {
    let playerLoc = this.getPlayerLocation(player);

    if(playerLoc === this.monsterLocation && this.monsterIsAlive)
      return true;

    return false;
  }

  public intro(player: Player): string {
    return `WELCOME TO THE LABYRINTH!
You're stuck on the UW campus and need to get home on the lightrail.
Find your way back without running into anyone unpleasant` + this.arriveNewLocation(player);
  }

  private arriveNewLocation(player: Player): string {
    let playerLoc = this.getPlayerLocation(player)

    return `
${playerLoc.getName()}
${this.getLocationDescription(player)}
What would you like to do?`;
  }

  public getLocationDescription(player: Player): string {
    let playerLoc = this.getPlayerLocation(player);
    if (this.playerIsInDanger(player)) {
      return `Focus on the fight!`;
    } else {
      return `${playerLoc.getDescription()}`;
    }
  }

  // Monster moves upon successful player move
  public movePlayer(player: Player, direction: string): string {
    let response = ``;
    
    if (!this.playerIsInDanger(player)) {
      let playerLoc = this.getPlayerLocation(player);
      let newLocation = playerLoc.getLocationInDirection(direction, player);

      if (typeof newLocation !== "string") {
        response += newLocation.passHazard(player);
        this.setPlayerLocation(player, newLocation)

        if (this.monsterIsAlive && this.playerIsInDanger(player)) {
          response += `${this.bossBattleDialogue(player)}
It is time to fight!`;
        } else {
          response += this.arriveNewLocation(player);
        }
      } else {
        response += newLocation;
      }
    } else {
      response += `It is time to fight!`;
    }

    return response;
  }

  // Monster is static for purposes of testing
  // Monsters should be implemented with random movements
  // Do not move if in the same area as player
  // If you run into player, flag danger
  public moveMonster(player: Player): string {
      return ``;
  }

  private bossBattleDialogue(player: Player): string {
    let response = `
${this.monster.getDescription()}`

    if (player.hasUsedItem(this.monster.getWeakness())) {
      response += `
You already used the item ${this.monster.getWeakness().getName()} needed to defeat ${this.monster.getName()}!
${this.monster.playerDefeated()}`
      
      this.setPlayerStatus(player, false);
    } 

    return response;
  }

  private didBeatBoss(player: Player, itemName: string): string {
    let response = ``;
    
    if (!player.hasUsedItem(this.monster.getWeakness())) {
      player.useItem(itemName)
      let overcame: boolean = player.didPlayerOvercome(this.monster);

      if (overcame) {
        this.monsterIsAlive = false;
        
        response += `
${this.monster.monsterDefeated()}
${this.arriveNewLocation(player)}`
      } else {
        this.setPlayerStatus(player, false);

        response += `You needed to use ${this.monster.getWeakness().getName()} to defeat ${this.monster.getName()}!
${this.monster.playerDefeated()}`
      }
    } else {
      this.setPlayerStatus(player, false);

      response += `You needed to use ${this.monster.getWeakness().getName()} to defeat ${this.monster.getName()}!
${this.monster.playerDefeated()}`
    }

    return response;
  }

  private checkIfGameOver(player: Player): string {
    let playerLoc = this.getPlayerLocation(player);

    if (playerLoc === this.goalLocation && this.gameIsActive && !this.playerIsInDanger(player)) {
      this.gameIsActive = false;
      return "You win!";
    } else {
      player.useItem(this.treasure.getName())
      this.setPlayerStatus(player, false);
      return "You lose! You needed that!";
    }
  }

  public getGameStatus() {
    return this.gameIsActive;
  }

  public checkInventory(player: Player): string {
    return player.listInventory()
  }

  public takeItem(player: Player, itemName: string): string {
    if (this.playerIsInDanger(player)) {
      return `No time to grab things! Time to fight!`;
    } else {
      let playerLoc = this.getPlayerLocation(player);
      let item = playerLoc.getItem(itemName);

      if (item !== undefined) {
        if(player.takeItem(item))
          return `You take the ${item.getName()}.`
        else
          playerLoc.setItem(item)
          return `You don't need another ${item.getName()}!`
      } else {
        return `No item by that name here!`
      }
    }
  }

  public useItem(player: Player, itemName: string): string {
    if (itemName === this.treasure.getName() && player.hasItem(this.treasure.getName())) {
      return this.checkIfGameOver(player);
    } else {
      if (this.playerIsInDanger(player)) {
        return this.didBeatBoss(player, itemName);
      } else {
        return player.useItem(itemName);
      }
    }
  }

  public dropItem(player: Player, itemName: string): string {
    if (this.playerIsInDanger(player)) {
      return `It's not the time to drop things! It's time to fight!`;
    } else {
      let playerLoc = this.getPlayerLocation(player)
      let item = player.dropItem(itemName);

      if(item !== undefined) {
        playerLoc.setItem(item)
        return `You dropped the ${itemName}`
      } else {
        return `You don't have that item.`
      }
    }
  }

  public dropAllItems(player: Player): void {
    let playerLoc = this.getPlayerLocation(player)
    let items = player.dropAllItems()

    items.forEach((item) => {
      playerLoc.setItem(item)
    })
  }
}