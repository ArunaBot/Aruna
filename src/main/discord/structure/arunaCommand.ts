import { ICommandPermission } from '../interfaces';
import { Discord } from 'arunabase';

export class ArunaCommand extends Discord.CommandStructure {
  protected permissions: ICommandPermission = { botDeveloper: false };

  public isDeveloperOnly(): boolean {
    return this.permissions.botDeveloper ?? false;
  }

  public getBotRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.botRequiredPermissions ?? [];
  }

  public getUserRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.userRequiredPermissions ?? [];
  }
}

export class ArunaAsyncCommand extends Discord.AsyncCommandStructure {
  protected permissions: ICommandPermission = { botDeveloper: false };

  public isDeveloperOnly(): boolean {
    return this.permissions.botDeveloper ?? false;
  }

  public getBotRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.botRequiredPermissions ?? [];
  }

  public getUserRequiredPermissions(): Discord.PermissionFlags[] {
    return this.permissions.userRequiredPermissions ?? [];
  }
}
