import { Interfaces } from 'arunabase';

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

export interface IDiscordFullCommandContext extends Interfaces.IDiscordCommandContext, IDiscordProperties { }
