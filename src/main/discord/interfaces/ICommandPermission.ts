import { Discord } from 'arunabase';

export interface ICommandPermission {
  botDeveloper?: boolean;
  botRequiredPermissions?: Discord.PermissionFlags[];
  userRequiredPermissions?: Discord.PermissionFlags[];
}
