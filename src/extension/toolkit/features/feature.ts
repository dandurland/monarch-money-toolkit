
export class Feature {

  featureName = this.constructor.name;
  settings: any = { enabled: false };

  css(): string {
    return '';
  }

  initialize(): void {
    throw Error('Required initialize func not implemented');
  }

  destroy(): void {

  }

}