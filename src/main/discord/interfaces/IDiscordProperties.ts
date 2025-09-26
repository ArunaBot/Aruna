import { DatabaseConnection } from 'promiseorm';
import { Discord } from 'arunabase';

export interface IDiscordProperties {
    fileVersion: number;
    urls: {
        twitch: string;
        youtube: string;
        github: string;
        discord: string;
        website: string;
    },
    botDevelopers: string[];
    emojiList: { [key: string]: string };
}

export interface IDiscordFullCommandContext extends Discord.ICommandContext, IDiscordProperties {
  databaseConnection: DatabaseConnection;
}
