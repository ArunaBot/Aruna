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
const chalk = require('chalk');
const { config } = require('../Configs');
const pkg = require('../package.json');

const language = require(`../languages/bot/${config.language}/internal.json`);

const del = require('del');

try {
  del.sync('tmp');
} finally {
  const manager = new Discord.ShardingManager(`./${pkg.main}`, {
    token: config.token, 
    totalShards: config.sharding.totalShards
  });

  const infoPrefix = `${chalk.gray('[')}${chalk.green(language.generic.core.toUpperCase())}${chalk.gray(']')}`;
  const errorPrefix = `${chalk.gray('[')}${chalk.red(language.generic.core.toUpperCase())}${chalk.gray(']')}`;
  const logPrefix = `${chalk.gray('[')}${chalk.yellow(language.shard.master)}${chalk.gray(']')}`;

  console.log(language.initialization.initializing.replace('[prefix]', infoPrefix));

  manager.on('shardCreate', shard => {
    console.log(`${infoPrefix} ${logPrefix} ${shard.id} (${shard.id + 1}/${manager.totalShards}) ${language.shard.launch.replace('[shard] ', '')}`);
  });
  
  process.on('exit', code => {
    console.error(`${errorPrefix} ${language.initialization.fail}`);
    console.exception(`${errorPrefix} ${logPrefix} ${chalk.red(language.shard.exit)} ${language.shard.exitCode}`, code);
  });

  console.log(language.shard.startGeneration.replace('[logPrefix]', `${infoPrefix} ${logPrefix}`));
  manager.spawn(config.sharding.totalShards, config.sharding.delay).then(() => {
    console.log(`${infoPrefix} ${logPrefix} ${chalk.green(language.shard.finishGeneration)}`);
    console.log(`${infoPrefix} ${language.initialization.complete}`);
  });
}