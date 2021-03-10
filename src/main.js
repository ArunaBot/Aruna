/* eslint-disable max-len */
/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2020

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const Discord = require('discord.js');
const fs = require('fs');
const { config, database } = require('../Configs');
const chalk = require('chalk');
const pkg = require('../package.json');

const language = require(`../languages/bot/${config.language}/internal.json`);
const defaultLanguage = require(`../languages/bot/${config.defaultLanguage}/internal.json`);

const infoPrefix = `${chalk.gray('[')}${chalk.green(language.generic.base.toUpperCase())}${chalk.gray(']')}`;

console.log(language.initialization.initializing.replace('[prefix]', infoPrefix));
console.log(`${infoPrefix} ${language.initialization.language.replace('[language]', chalk.yellow(language.generic.languageName)).replace('[default]', chalk.yellow(defaultLanguage.generic.languageName))}`);
console.log(`${infoPrefix} ${language.initialization.version.replace('[version]', pkg.version)}`);

const aruna = new Discord.Client();
aruna.commands = new Discord.Collection();
aruna.aliases = new Discord.Collection();

global.bot = { aruna: aruna, config: config, database: database, languageI: language};

const { logger } = require('./Utils');

fs.readdir('./src/Events/', (erro, files) => {
  if (erro) return logger.error(`[${language.main.error}] => ${erro}`);
  const jsfile = files.filter(f => f.split('.').pop() === 'js');
  if (jsfile.length <= 0) {
    return logger.warn(`[${language.main.events}] ${language.generic.notFound}`);
  }
  files.forEach(file => {
    const eventFunction = require(`./Events/${file}`);
    logger.log(`[${language.main.event}] => ${file}`);
    const eventName = file.split('.')[0];
    aruna.on(eventName, (...args) => eventFunction.run(aruna, ...args));
  });
});

fs.readdir('./src/Commands/', (err, files) => {
  if (err) return logger.error(`[${language.main.error}] => ${err}`);
  const jsfile = files.filter(f => f.split('.').pop() === 'js');
  if (jsfile.length <= 0) {
    return logger.warn(`[${language.main.commands}] ${language.generic.notFound}`);
  }
  jsfile.forEach(async f => {
    const pull = require(`./Commands/${f}`);
    aruna.commands.set(pull.config.name, pull);
    if (pull.config.register) {
      const verReg = await database.Commands.findOne({ _id: pull.config.name });
      if (!verReg) {
        const reg = new database.Commands({ _id: pull.config.name, public: pull.config.register.public });
        await reg.save();
        logger.debug(`[${language.main.command}] [${language.main.cluster}] ${language.main.registered.replace('[COMMAND]', pull.config.name)}`);
      }
    }
    logger.log(`[${language.main.command}] => ${f}`);
    pull.config.aliases.forEach(alias => {
      aruna.aliases.set(alias, pull.config.name);
    });
  });
});

aruna.login(config.token).then(async () => {
  await logger.log(`=> ${language.initialization.complete}`);
}).catch(e => {
  logger.error(`=> ${language.initialization.fail} ${e}`);
});