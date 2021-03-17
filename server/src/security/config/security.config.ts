interface SecurityBuilder {
  addUrl(url: string): void;
  verify(verifyingUrl: string): boolean;
}

export class SecurityConfiguration {
  private allowUrl: string[];
  constructor() {
    this.allowUrl = [];
  }
  public addUrl(url: string): this {
    this.allowUrl.push(url);
    return this;
  }

  public verify(verifyingUrl: string): boolean {
    return this.allowUrl.some(url => verifyingUrl.includes(url));
  }
}
