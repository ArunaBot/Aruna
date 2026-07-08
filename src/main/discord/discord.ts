import { DatabaseConnection, DatabaseManager, MariaDBConnection } from 'promiseorm';
import { IBaseClient, IConfiguration, IDatabaseConfiguration } from '../common';
import { ILoggerOptions, Logger } from '@promisepending/logger.js';
import { ArunaCommandBased, BaseEvent } from './structure';
import { IDiscordFullCommandContext, IDiscordProperties } from './interfaces';
import { ConfigurationLoader } from '../api';
import { Discord } from 'arunabase';
import * as path from 'path';
import * as fs from 'fs';

export class DiscordClient implements IBaseClient {
  private configurationLoader: ConfigurationLoader | undefined;
  private config: IConfiguration['discord'] & Discord.IConfiguration;
  private customProperties: IDiscordProperties;
  private client: Discord.DiscordClient;
  private database: DatabaseConnection;
  private logger: Logger;

  constructor(
    configs: IConfiguration['discord'] & Discord.IConfiguration,
    loggerOptions?: ILoggerOptions,
    configurationLoader?: ConfigurationLoader,
    dbConfig?: IDatabaseConfiguration['database'],
  ) {
    this.configurationLoader = configurationLoader;
    this.customProperties = (this.configurationLoader?.loadJsonResource('discordProperties') ?? {}) as IDiscordProperties;
    configs.additionalCommandContext = { ...configs.additionalCommandContext ?? {}, ...this.customProperties };
    this.logger = new Logger({ prefix: 'DISCORD', ...loggerOptions ?? {} });
    
    const db = new DatabaseManager().getConnection('global');
    if (!db && dbConfig) {
      // Probably running in a sharding environment. We need to create a new connection
      this.logger.warn('No database connection found, creating a new one');
      this.database = new MariaDBConnection({
        hostname: dbConfig.host,
        port: dbConfig.port ?? 3306,
        username: dbConfig.credentials.user,
        password: dbConfig.credentials.password,
        database: dbConfig.credentials.database,
      });
    } else if (!db) {
      this.logger.error('No database connection found and no database configuration provided');
      throw new Error('No database connection found and no database configuration provided');
    } else {
      this.database = db;
    }
    
    configs.additionalCommandContext = { ...configs.additionalCommandContext ?? {}, ...this.customProperties, databaseConnection: this.database } as IDiscordFullCommandContext;
    this.client = new Discord.DiscordClient(configs, this.logger);
    this.config = configs;
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.client.on(event, listener);
  }

  public getDiscordClient(): Discord.DiscordClient {
    return this.client;
  }

  public async start(): Promise<void> {
    this.registerEvents();
    await this.registerModels();
    this.client.login(this.config.token);
  }

  public async registerModels(): Promise<void> {
    if (this.config.shardId !== null) {
      let stop = false;
      this.logger.debug('Registering database connection for shard ' + this.config.shardId);
      await DatabaseManager.instance.registerConnection(`shard-${this.config.shardId}`,this.database).catch((err) => {
        this.logger.error('Error registering database connection for shard ' + this.config.shardId, err);
        stop = true;
      });
      if (stop) {
        this.logger.error('Stopping shard ' + this.config.shardId);
        process.exit(1);
        return;
      }
    }
    const models = fs.readdirSync(path.join(__dirname, 'models'));
    for await (const model of models) {
      if (!model.endsWith('.js')) continue;

      try {
        this.logger.debug('Registering model ' + model);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const modelFile = require(path.join(__dirname, 'models', model));
        await this.database.registerModel(model.substring(0, model.length - 3).toLowerCase().replace('model', ''), new modelFile.default(this));
      } catch (error) {
        this.logger.error('An error occurred while registering model ' + model, error);
      }
    }
  }

  public async registerCommands(): Promise<void> {
    if (this.client.getCommandManager().getCommands().length > 0) {
      this.logger.warn('Commands already registered! Skipping...');
      return;
    }

    fs.readdir(path.join(__dirname, 'commands'), async (err, files) => {
      if (err) {
        this.logger.error(err);
        return;
      }

      const commands: ArunaCommandBased[] = [];

      for await (const file of files) {
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
      
      try {
        await this.client.getCommandManager().registerCommand(commands);
        this.logger.debug('All commands (probably) successfully registered!');
      } catch (error) {
        this.logger.error('┌───────────────────────────────────────────────────────────────┐');
        this.logger.error('│                     THIS IS NOT A DRILL!                      │');
        this.logger.error('│                                                               │');
        this.logger.error('│ The bot failed to register commands!                          │');
        this.logger.error('│ This is a critical error and the bot might not work properly. │');
        this.logger.error('│ Please check the logs for more information.                   │');
        this.logger.error('└───────────────────────────────────────────────────────────────┘');
        this.logger.error('An error occurred while registering commands!\n', error);
      }
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

  public getConfig(): IConfiguration['discord'] & Discord.IConfiguration {
    return this.config;
  }

  public getDatabaseConnection(): DatabaseConnection {
    return this.database;
  }

  public getCustomProperties(): IDiscordProperties {
    return this.customProperties;
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
