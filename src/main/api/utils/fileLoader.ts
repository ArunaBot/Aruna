import * as path from 'path';
import fs from 'fs';

export class FileLoader {
  /**
   * Loads a file and returns it as a string
   * @note This function does not check if the file exists. Always prefer {@link safeLoad}
   * @param filePath The path to the file
   * @returns The file as a string
   */
  public static load(filePath: string): string {
    return fs.readFileSync(path.resolve(filePath), 'utf8');
  }

  /**
   * Safely loads a file and returns it as a string
   * @param filePath The path to the file
   * @param defaultFile The default file to write if the file doesn't exist
   * @returns The file as a string
   */
  public static safeLoad(filePath: string, defaultFile?: string): string | null {
    if (!fs.existsSync(filePath)) {
      if (!defaultFile) return null;
      // create the directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, defaultFile, 'utf8');
      return defaultFile;
    }
    return FileLoader.load(filePath);
  }

  /**
   * Safely loads a JSON file and returns it as an object
   * @param filePath The path to the file
   * @param defaultFile The default file to write if the file doesn't exist
   * @returns The JSON file as an object
   */
  public static jsonLoader(filePath: string, defaultFile?: string): unknown {
    return JSON.parse(FileLoader.safeLoad(filePath, defaultFile)!);
  }
}
