import { ArunaCommandBased, BaseEvent } from './structure';
import { ILoggerOptions, Logger } from '@promisepending/logger.js';
import { IDiscordProperties } from './interfaces';
import { Discord, Interfaces } from 'arunabase';
import { ConfigurationLoader } from '../api';
import * as path from 'path';
import * as fs from 'fs';

export class DiscordClient {
  private configurationLoader: ConfigurationLoader | undefined;
  private config: Interfaces.IDiscordConfiguration;
  private customProperties: IDiscordProperties;
  private client: Discord.DiscordClient;
  private logger: Logger;

  constructor(configs: Interfaces.IDiscordConfiguration, loggerOptions?: ILoggerOptions, configurationLoader?: ConfigurationLoader) {
    this.configurationLoader = configurationLoader;
    this.customProperties = (this.configurationLoader?.loadJsonResource('discordProperties') ?? {}) as IDiscordProperties;
    configs.additionalCommandContext = { ...configs.additionalCommandContext ?? {}, ...this.customProperties };
    this.logger = new Logger({ prefix: 'DISCORD', ...loggerOptions ?? {} });
    this.client = new Discord.DiscordClient(configs, this.logger);
    this.config = configs;
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.client.on(event, listener);
  }

  public getDiscordClient(): Discord.DiscordClient {
    return this.client;
  }

  public start(): void {
    this.registerEvents();
    this.client.login(this.config.token);
  }

  public async registerCommands(): Promise<void> {
    if (this.client.getCommandManager().getGlobalCommands().size > 0) {
      this.logger.warn('Commands already registered! Skipping...');
      return;
    }

    fs.readdir(path.join(__dirname, 'commands'), async (err, files) => {
      if (err) {
        this.logger.error(err);
        return;
      }

      const commands: ArunaCommandBased[] = [];

      for (const file of files) {
        if (!file.endsWith('.js')) continue;

        try {
          this.logger.debug(`Preparing register of the ${file} command...`);
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const commandFile = require(path.join(__dirname, 'commands', file));
          commands.push(new commandFile.default());
        } catch (error) {
          this.logger.error('An error occurred while registering command ' + file, error);
        }
      }
      await this.client.getCommandManager().registerCommand(commands);
      this.logger.debug('All commands (probably) successfully registered!');
    });
  }

  private async registerEvents(): Promise<void> {
    fs.readdir(path.join(__dirname, 'events'), async (err, files) => {
      if (err) {
        this.logger.error(err);
        return;
      }

      for await (const file of files) {
        if (!file.endsWith('.js')) continue;

        try {
          this.logger.debug('Registering event ' + file);
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const eventFile = require(path.join(__dirname, 'events', file));
          const event: BaseEvent = new eventFile.default(this);
          if (event.runOnce()) {
            this.client.once(event.getName(), (...args: any[]) => event.preExecute(...args).catch((error) => {
              this.logger.error('An error occurred while executing single-run event ' + event.getName(), error);
            }));
          } else {
            this.client.on(event.getName(), (...args: any[]) => event.preExecute(...args).catch((error) => {
              this.logger.error('An error occurred while executing event ' + event.getName(), error);
            }));
          }
        } catch (error) {
          this.logger.error('An error occurred while registering event ' + file, error);
        }
      }
    });
  }

  public getCommandManager(): Discord.CommandManager {
    return this.client.getCommandManager();
  }

  public getConfig(): Interfaces.IDiscordConfiguration {
    return this.config;
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
