const Discord = require("discord.js");
const chalk = require("chalk");
const config = require("./configs/cf.js");
const pkg = require("./package.json");

const manager = new Discord.ShardingManager(`./${pkg.main}`, {
  token: process.env.TOKEN_ARUNA_CANARY,
  totalShards: config.sharding.totalShards
});

const logPrefix = `${chalk.gray("[")}${chalk.yellow("SHARD MASTER")}${chalk.gray("]")}`;

manager.on("launch", shard => console.log(`${logPrefix} ${shard.id} (${shard.id + 1}/${manager.totalShards}) iniciado(s)`));
process.on("exit", code => console.log(`${logPrefix} ${chalk.red("Foi forçado o encerramento de um processo.")} Exit code:`, code));

console.log(`${logPrefix} Começando a gerar shards...`);
manager.spawn(config.sharding.totalShards, config.sharding.delay).then(() => {
  console.log(`${logPrefix} ${chalk.green("Finalizando a geração dos Shards!")}`);
});