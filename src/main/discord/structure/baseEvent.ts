/* eslint-disable @typescript-eslint/no-unused-vars */
import { DiscordClient } from '../discord';

export class BaseEvent {
  protected client: DiscordClient;
  protected runned = false;
  protected once = false;
  protected name: string;

  constructor(name: string, client: DiscordClient, once = false) {
    this.name = name;
    this.once = once;
    this.client = client;
  }

  public runOnce(): boolean {
    return this.once;
  }

  public getName(): string {
    return this.name;
  }

  public async preExecute(...args: any[]): Promise<void> {
    if (this.runned && this.once) return;
    this.runned = true;
    return this.execute(...args);
  }

  // eslint-disable-next-line no-unused-vars
  protected async execute(...args: any[]): Promise<void> {
    throw new Error(`The run method has not been implemented for event ${this.name}`);
  }
}
