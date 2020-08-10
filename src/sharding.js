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

const manager = new Discord.ShardingManager(`./${pkg.main}`, {
  token: config.token, 
  totalShards: config.sharding.totalShards
});

const logPrefix = `${chalk.gray('[')}${chalk.yellow('SHARD MASTER')}${chalk.gray(']')}`;

manager.on('launch', shard => console.log(`${logPrefix} ${shard.id} (${shard.id + 1}/${manager.totalShards}) ${language.shard.launch.replace('[shard] ', '')}`));
process.on('exit', code => console.log(`${logPrefix} ${chalk.red(language.shard.exit)} ${language.shard.exitCode}`, code));

console.log(language.shard.startGeneration.replace('[logPrefix]', logPrefix));
manager.spawn(config.sharding.totalShards, config.sharding.delay).then(() => {
  console.log(`${logPrefix} ${chalk.green(language.shard.finishGeneration)}`);
});