/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2021

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

const chalk = require('chalk');

const { aruna, config, languageI } = global.bot;

const infoPrefix = `${chalk.gray('[')}${chalk.green(languageI.generic.base.toUpperCase())}${chalk.gray(']')}`;
const errorPrefix = `${chalk.gray('[')}${chalk.red(languageI.generic.base.toUpperCase())}${chalk.gray(']')}`;

function logPrefix() {
  return `${chalk.gray('[')}${isSharded() ? `${languageI.generic.shard} ${chalk.blue(process.env.currentShard)}` : aruna.user.username}${chalk.gray(']')}`;
}
  
async function log(...a) {
  return console.log(infoPrefix, logPrefix(), ...a);
}
  
async function warn(...a) {
  return console.warn(logPrefix(), chalk.yellow(...a));
}
  
async function error(...a) {
  return console.error(errorPrefix, logPrefix(), chalk.red(...a));
}

async function debug(...a) {
  if (config.debug) {
    return console.debug(logPrefix(), chalk.magenta(...a));
  } else return;
}
  
function isSharded() {
  return !!aruna.shard;
}

module.exports = {
  debug: debug,
  log: log,
  warn: warn,
  error: error
};