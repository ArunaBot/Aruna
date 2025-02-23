import { Logger } from '@promisepending/logger.js';
import { IConfiguration } from '../../interfaces';
import { FileLoader } from '../utils';
import path from 'path';

export class ConfigurationLoader {
  private logger: Logger;

  constructor(debug = false) {
    this.logger = new Logger({ prefix: 'CONFIG', debug, allLineColored: true });
  }

  /**
   * Load the configuration file, if not found, load the default configuration file and save it
   * @returns {IConfiguration} The configuration file
   */
  public loadConfiguration(): IConfiguration {
    const defaultConfig = FileLoader.load(path.resolve(__dirname, '..', '..', 'resources', 'default_global_config.json'));
    const configs = FileLoader.jsonLoader(path.resolve(__dirname, '..', '..', '..', 'config', 'global_config.json'), defaultConfig) as IConfiguration;
    this.logger.info('Configuration loaded');
    return configs;
  }

  public loadJsonResource(resource: string): unknown {
    const defaultResource = FileLoader.safeLoad(path.resolve(__dirname, '..', '..', 'resources', `default_${resource}.json`)) ?? '{}';

    if (defaultResource === '{}') this.logger.warn(`Default ${resource} not found or is empty, using empty object`);

    const resources = FileLoader.jsonLoader(path.resolve(__dirname, '..', '..', '..', 'config', `${resource}.json`), defaultResource);

    if (JSON.stringify(resources) === '{}') {
      this.logger.error(`No ${resource} found or is empty!`);
      return null;
    }

    this.logger.debug(`${resource} loaded`);
    return resources;
  }
}
