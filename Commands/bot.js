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

function format(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);
  var days = Math.floor(hours / 24);

  if (pad(days) >= "1") {
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
  } else if (pad(hours) >= "1") {
    return pad(hours) + "h " + pad(minutes) + "m " + pad(seconds) + "s";
  } else if (pad(minutes) >= "1") {
    return pad(minutes) + "m " + pad(seconds) + "s";
  } else {
    return pad(seconds) + "s";
  }
}

const { config } = require("../configs");

const pak = require("../package.json");

const emoji = require("../utils/emojis.js");

exports.run = (aruna, message, args, prefix) => {
  let user = message.guild.member(aruna.user);

  let name = user.nickname !== null ? user.nickname : aruna.user.username;

  /*let embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .addField(`(${emoji.robot}) Nome na Guild`, `**${name}**`, true)
    .addField(`(📡) Versão`, `**${pak.version}**`, true)
    .addField(`(🏓) Ping`, `**${Math.round(aruna.ping)}** ms`, true)
    .addField(`(📃) Canais`, `**${aruna.channels.size}**`, true)
    .addField(`(🖥️) Servidores`, `**${aruna.guilds.size}**`, true)
    .addField(`(🕹️) Usuários`, `**${aruna.users.size}**`, true)
    .addField(
      `Convite`,
      `**[Link](https://discordapp.com/api/oauth2/authorize?client_id=593303574725787657&permissions=37604422&scope=bot)**`,
      true
    )
    .addField(`Meu Site`, `**Em Breve™️**`, true)
    .addField(
      `Servidor de Suporte`,
      `**[Link](https://discord.gg/NqbBgEf)**`,
      true
    )
    .setThumbnail(`${aruna.user.displayAvatarURL}`);*/
  let embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .addField(`(${emoji.robot}) Nome na Guild`, `**${name}**`, true)
    .addField(`(📡) Versão`, `**${pak.version}**`, true)
    .addField(`(🕰️) Uptime`, `**${format(process.uptime())}**`, true)
    .addField(`(📃) Canais`, `**${aruna.channels.size}**`, true)
    .addField(`(🖥️) Servidores`, `**${aruna.guilds.size}**`, true)
    .addField(`(🕹️) Usuários`, `**${aruna.users.size}**`, true)
    .addField(
      `Convite`,
      `**[Link](https://discordapp.com/api/oauth2/authorize?client_id=593303574725787657&permissions=37604422&scope=bot)**`,
      true
    )
    .addField(`Meu Site`, `**Em Breve™️**`, true)
    .addField(
      `Servidor de Suporte`,
      `**[Link](https://discord.gg/NqbBgEf)**`,
      true
    )
    .setThumbnail(`${aruna.user.displayAvatarURL}`);
  message.channel.send(embed);
};

exports.config = {
  name: "bot",
  aliases: ["botinfo", "info"],
  description: "Lista as Principais informações do bot",
  category: `${emoji.robot} Utilidades`
};
