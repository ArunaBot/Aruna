import { IAsyncCommandOptions, ICommandOptions, IDiscordCommandContext } from 'arunabase/build/interfaces';
import { ICommandPermission } from '../interfaces';
import { Discord } from 'arunabase';

export interface IExtendedCommandOptions extends ICommandOptions {
  category?: string;
}

export interface IExtendedAsyncCommandOptions extends IAsyncCommandOptions {
  category?: string;
}

export class ArunaCommand extends Discord.CommandStructure {
  protected permissions: ICommandPermission = { botDeveloper: false };
  protected category: string;

  constructor(name: string, options: IExtendedCommandOptions) {
    super(name, options);
    this.category = options.category ?? 'General';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override checkPermission(context: IDiscordCommandContext, silent = false): boolean {
    return super.checkPermission(context);
  }

  public isDeveloperOnly(): boolean {
    return this.permissions.botDeveloper ?? false;
  }

  public getBotRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.botRequiredPermissions ?? [];
  }

  public getUserRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.userRequiredPermissions ?? [];
  }

  public getCategory(): string {
    return this.category;
  }
}

export class ArunaAsyncCommand extends Discord.AsyncCommandStructure {
  protected permissions: ICommandPermission = { botDeveloper: false };
  protected category: string;

  constructor(name: string, options: IExtendedAsyncCommandOptions) {
    super(name, options);
    this.category = options.category ?? 'General';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override checkPermission(context: IDiscordCommandContext, silent = false): boolean {
    return super.checkPermission(context);
  }

  public isDeveloperOnly(): boolean {
    return this.permissions.botDeveloper ?? false;
  }

  public getBotRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.botRequiredPermissions ?? [];
  }

  public getUserRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.userRequiredPermissions ?? [];
  }

  public getCategory(): string {
    return this.category;
  }
}

export type ArunaCommandBased = ArunaCommand | ArunaAsyncCommand;
