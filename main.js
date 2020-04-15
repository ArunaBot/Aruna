require("events").EventEmitter.defaultMaxListeners = 999;

const express = require("express");
const http = require("http");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

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

//aruna.login(process.env.TOKEN_ARUNA);
