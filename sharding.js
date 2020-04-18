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

const Discord = require("discord.js");
const chalk = require("chalk");
const config = require("./configs/cf.js");
const pkg = require("./package.json");

const manager = new Discord.ShardingManager(`./${pkg.main}`, {
  token: process.env.TOKEN_ARUNA,
  totalShards: config.sharding.totalShards
});

const logPrefix = `${chalk.gray("[")}${chalk.yellow("SHARD MASTER")}${chalk.gray("]")}`;

manager.on("launch", shard => console.log(`${logPrefix} ${shard.id} (${shard.id + 1}/${manager.totalShards}) iniciado(s)`));
process.on("exit", code => console.log(`${logPrefix} ${chalk.red("Foi forçado o encerramento de um processo.")} Exit code:`, code));

console.log(`${logPrefix} Começando a gerar shards...`);
manager.spawn(config.sharding.totalShards, config.sharding.delay).then(() => {
  console.log(`${logPrefix} ${chalk.green("Finalizando a geração dos Shards!")}`);
});