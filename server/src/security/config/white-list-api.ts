import { blackList } from '../../utils/constants/permission-desc';

export class WhiteListConfiguration {
  private allowUrl: string[];
  constructor() {
    this.allowUrl = [...blackList, 'types'];
  }
  public addUrl(url: string): this {
    this.allowUrl.push(url);
    return this;
  }

  public verify(verifyingUrl: string): boolean {
    return this.allowUrl.some(url => verifyingUrl.includes(url));
  }
}
