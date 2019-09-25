export class Item {
  private name: string;
  private passiveDescription: string;
  private activeDescription: string;

  constructor(name: string, passive: string, active: string) {
    this.name = name;
    this.passiveDescription = passive;
    this.activeDescription = active;
  }

  getName(): string {
    return this.name;
  }

  getPassiveDescription(): string {
    return this.passiveDescription;
  }

  getActiveDescription(): string {
    return this.activeDescription;
  }
}