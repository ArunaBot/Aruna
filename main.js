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

var oficialMode = 0;

if (process.env.OFICIAL_MODE === true) oficialMode = "";
else oficialMode = "(BETA)";

const Discord = require("discord.js");
const fs = require("fs");
const { config } = require("./configs")
const pkg = require("./package.json");
const chalk = require("chalk");

const aruna = new Discord.Client();
aruna.commands = new Discord.Collection();
aruna.aliases = new Discord.Collection();

fs.readdir("./events/", (erro, files) => {
  if (erro) return error(`[ERROR] => ${erro}`);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    log(`[COMMAND] => ${file}`);
    let eventName = file.split(".")[0];
    aruna.on(eventName, (...args) => eventFunction.run(aruna, ...args));
  });
});

fs.readdir("./Commands/", (err, files) => {
  if (err) return error(`[ERROR] => ${err}`);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    return warn("[COMMANDS] Not Found!");
  }
  jsfile.forEach((f, i) => {
    let pull = require(`./Commands/${f}`);
    aruna.commands.set(pull.config.name, pull);
    log(`[COMMAND] => ${f}`);
    pull.config.aliases.forEach(alias => {
      aruna.aliases.set(alias, pull.config.name);
    });
    aruna.on("ready", () => {
      aruna.channels
        .get(`660612304282583043`)
        .setName(`🧩Comandos: ${jsfile.length}`);
    });
  });
});


function logPrefix() {
  return `${chalk.gray("[")}${isSharded() ? `SHARD ${chalk.blue(aruna.shard.id)}` : "ARUNA"}${chalk.gray("]")}`;
}

function log(...a) {
  return console.log(logPrefix(), ...a);
}

function warn(...a) {
  return console.warn(logPrefix(), chalk.yellow(...a));
}

function error(...a) {
  return console.error(logPrefix(), chalk.red(...a));
}

function debug(...a) {
  return console.debug(logPrefix(), chalk.magenta(...a));
}

function isSharded() {
  return !!aruna.shard;
}

aruna.login(config.token);
