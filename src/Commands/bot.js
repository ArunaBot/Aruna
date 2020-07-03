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
  var days = Math.floor(seconds % (3600 * 24));

  if (pad(days) >= "1") {
    return (
      pad(days) +
      "d " +
      pad(hours - 24) +
      "h " +
      pad(minutes) +
      "m"
    );
  } else if (pad(hours) >= "1") {
    return pad(hours) + "h " + pad(minutes) + "m " + pad(seconds) + "s";
  } else if (pad(minutes) >= "1") {
    return pad(minutes) + "m " + pad(seconds) + "s";
  } else {
    return pad(seconds) + "s";
  }
}

const pak = require("../../package.json");

const { emojis } = require("../Utils");

const { links } = require("../../Configs")

exports.run = (aruna, message, args, prefix) => {
  let user = message.guild.member(aruna.user);

  let name = user.nickname !== null ? user.nickname : aruna.user.username;

  let embed = new Discord.RichEmbed()
    .setAuthor(aruna.user.username, `${aruna.user.avatarURL}`)
    .addField(`(${emojis.robot}) Nome na Guild`, `${name}`, true)
    .addField(`(📡) Versão`, `${pak.version}`, true)
    .addField(`(🕰️) Uptime`, `${format(process.uptime())}`, true)
    .addField(`(📃) Canais`, `${aruna.channels.size}`, true)
    .addField(`(🖥️) Servidores`, `${aruna.guilds.size}`, true)
    .addField(`(🕹️) Usuários`, `${aruna.users.size}`, true)
    .addField(
      `Convite`,
      `${links.invites[0] ? `[Link](${links.invites[0]})` : "INDISPONÍVEL"}`,
      true
    )
    .addField(`Meu Site`, `${links.website ? `[Link](${links.website})` : "Em Breve™️"}`, true)
    .addField(
      `Servidor de Suporte`,
      `${links.supportServers[0] ? `[Link](${links.supportServers[0]})` : "INDISPONÍVEL"}`,
      true
    )
    .setThumbnail(`${aruna.user.displayAvatarURL}`);
  message.channel.send(embed);
};

exports.config = {
  name: "bot",
  aliases: ["botinfo"],
  description: "Lista as Principais informações do bot",
  category: `${emojis.robot} Utilidades`
};
