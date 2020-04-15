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

/* global Map */

const Discord = require("discord.js");
const config = require("./config.json");
const db = require("quick.db");
const cooldown = require("./utils/cooldown.js");
const utils = require("./utils/utils.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(
  process.env.TOKEN_DBL,
  client
);

dbl.on("posted", () => {
  console.log("Server count posted!");
});

dbl.on("error", e => {
  console.log(`Oops! ${e}`);
});

const active = new Map();

const serverStatsPrincipal = {
  guildID: "610206821763776522"
};

client.on("ready", () => {
  console.log(
    "Bot iniciado\n\nUsuários: " +
      client.users.size +
      "\nServidores: " +
      client.guilds.size
  );
  //client.user.setActivity("Minha manutenção.", {type: "watching"});
  //client.user.setStatus("dnd")
  setInterval(() => {
    function format(seconds) {
      function pad(s) {
        return (s < 10 ? "0" : "") + s;
      }
      var hours = Math.floor(seconds / (60 * 60));
      var minutes = Math.floor((seconds % (60 * 60)) / 60);
      var seconds = Math.floor(seconds % 60);
      var days = Math.floor(hours / 24);

      return (
        pad(days) +
        "d " +
        pad(hours) +
        "h " +
        pad(minutes) +
        "m " +
        pad(seconds) +
        "s"
      );
    }
    var activities_list = [
      "Paz",
      "Alegria",
      "Muppet Show",
      "Netflix",
      `${client.guilds.size} Servidores`,
      `${client.users.size} Usuários`,
      `Faz ${format(process.uptime())}.`,
      `Meu Prefixo (${config.prefix})`
    ];
    const index = Math.floor(Math.random() * (activities_list.length - 1));
    var type = [
      { type: "streaming", url: `https://www.twitch.tv/lobometalurgico` },
      { type: "streaming", url: `https://www.twitch.tv/lobometalurgico` },
      { type: "watching" },
      { type: "watching" },
      { type: "watching" },
      { type: "watching" },
      { type: "playing" },
      { type: "listening" }
    ];
    client.user.setActivity(activities_list[index], type[index]);
  }, 15 * 1000);
  setInterval(() => {
    dbl.postStats(client.guilds.size);
  }, 900000);
  //setInterval(() =>{
  //let antidepressive = require(`./extrafunction/antidepressive.js`);
  //antidepressive.run(client);
  //}, 20 * 60000)
});

client.on("message", async message => {
  if (message.author.bot) return undefined;

  if (message.channel.type == "dm") {
    let interativitie = require(`./extrafunction/interativities.js`);
    interativitie.run(client, message);
  }

  const guild = message.guild;

  var prefix = await db.fetch(`prefix_${guild.id}`);

  if (prefix === null) {
    prefix = config.prefix;
  } else if (prefix === "default" || prefix === "Default") {
    prefix = config.prefix;
  }

  if (message == "<@593303574725787657>")
    return message.channel.send(
      `Olá, <@${message.author.id}>. Meu prefixo nesta guild é ` +
        "``" +
        prefix +
        "``."
    );
  if (message == "<@!593303574725787657>")
    return message.channel.send(
      `Olá, <@${message.author.id}>. Meu prefixo nesta guild é ` +
        "``" +
        prefix +
        "``."
    );

  //let antiinvite = require(`./extrafunction/antinvite.js`);
  //antiinvite.run(client, message);

  let xpsystem = require(`./extrafunction/xpsystem.js`);
  xpsystem.run(client, message, db, cooldown, utils, Discord);

  if (message.channel.id == "625381261393002496") {
    await message.react("✅");
    await message.react("❎");
  }

  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  let musicsystem = require(`./extrafunction/musicsystem.js`);
  musicsystem.run(client, message, args, command);

  //let commandhandler = require(`./core/commandhandler.js`)
  //commandhandler.run(client, message, args, command)

  try {
    let ops = {
      active: active
    };

    let commands = require(`./commands/${command}.js`);
    commands.run(client, message, args, ops);
  } catch (e) {
    message.reply("Comando não encontrado :(").then(msg => msg.delete(20000));
    console.log(e);
  } finally {
  }
});
client.on("guildMemberAdd", async member => {
  if (member.guild.id !== serverStatsPrincipal.guildID) return;
  member.addRole(`612094373995216926`, "AutoRole");
});

client.login(process.env.TOKEN_ARUNA);
