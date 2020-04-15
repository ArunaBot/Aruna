/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico 2019-2020

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

require("events").EventEmitter.defaultMaxListeners = 999;

var oficialMode = 0;

if (process.env.OFICIAL_MODE === true) oficialMode = "";
else oficialMode = "(BETA)";

const Discord = require("discord.js");
const fs = require("fs");
const cf = require("./configs/cf.js");
const pkg = require("./package.json");
const version = pkg.version + ` ${oficialMode}`;

const aruna = new Discord.Client();
aruna.commands = new Discord.Collection();
aruna.aliases = new Discord.Collection();

fs.readdir("./events/", (erro, files) => {
  if (erro) return console.error(`(ERROR) => ${erro}`);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    console.log(`(EVENT) => ${file}`);
    let eventName = file.split(".")[0];
    aruna.on(eventName, (...args) => eventFunction.run(aruna, ...args));
  });
});

fs.readdir("./cmds/", (err, files) => {
  if (err) return console.log(`(ERROR) => ${err}`);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    return console.log("(NONE) => Sem comandos!");
  }
  jsfile.forEach((f, i) => {
    let pull = require(`./cmds/${f}`);
    aruna.commands.set(pull.config.name, pull);
    console.log(`(COMMAND) => ${f}`);
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

aruna.login(process.env.TOKEN_ARUNA);
