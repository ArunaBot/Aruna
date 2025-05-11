import { BaseModel, EDatabaseTypes } from 'promisedb';

export default class GuildModel extends BaseModel {
  constructor() {
    super({
      id: {
        type: EDatabaseTypes.STRING,
        maxSize: 32,
        primaryKey: true,
        nullable: false,
      },
      prefix: {
        type: EDatabaseTypes.STRING,
        maxSize: 3,
        nullable: true,
      },
      antiInviteEnabled: {
        type: EDatabaseTypes.BOOLEAN,
        nullable: false,
        default: false,
      },
      autoRoleEnabled: {
        type: EDatabaseTypes.BOOLEAN,
        nullable: false,
        default: false,
      },
      autoRoleId: {
        type: EDatabaseTypes.STRING,
        maxSize: 32,
        nullable: true,
      },
      language: {
        type: EDatabaseTypes.STRING,
        maxSize: 5,
        nullable: false,
        default: 'en-US',
      },
      isPremium: {
        type: EDatabaseTypes.BOOLEAN,
        nullable: false,
        default: false,
      },
      isPartner: {
        type: EDatabaseTypes.BOOLEAN,
        nullable: false,
        default: false,
      },
    });
  }
}
