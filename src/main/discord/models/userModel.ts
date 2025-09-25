import { BaseModel, EDatabaseTypes } from 'promiseorm';

export default class UserModel extends BaseModel {
  constructor() {
    super({
      id: {
        type: EDatabaseTypes.STRING,
        maxSize: 32,
        primaryKey: true,
        nullable: false,
      },
      language: {
        type: EDatabaseTypes.STRING,
        maxSize: 5,
        nullable: true,
      },
      super: {
        type: EDatabaseTypes.BOOLEAN,
        nullable: false,
        default: false,
      },
    });
  }
}
