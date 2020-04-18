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
const emoji = require("../utils/emojis.js");

const status = {
  online: `${emoji.online} Online`,
  idle: `${emoji.idle} Ausente`,
  dnd: `${emoji.dnd} Não Pertube`,
  offline: `${emoji.offline} Offline`
};

exports.run = (aruna, message, args) => {
  var region = message.guild.region;

  if (region === "brazil") region = `:flag_br: Brasil`;
  if (region === "europe") region = ` :flag_eu: Europa`;
  if (region === "hongkong") region = `:flag_hk: Hong Kong`;
  if (region === "india") region = `:flag_in: India`;
  if (region === "japan") region = `:flag_jp: Japão`;
  if (region === "russia") region = `:flag_ru: Rússia`;
  if (region === "singapore") region = `:flag_br: Singapura`;
  if (
    region === "us-central" ||
    region === "us-east" ||
    region === "us-south" ||
    region === "us-west"
  )
    region = `:flag_us: Estados Unidos`;

  let embed = new Discord.RichEmbed()
    .setColor([0, 23, 132])
    .setAuthor(`${message.guild.name}`)
    .setThumbnail(
      `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`
    )
    .addField(":computer: ID da Guild", message.guild.id, true)
    .addField(":crown: Dono", `${message.guild.owner}`, true)
    .addField(":earth_americas: Região", `${region}`, true)
    .addField(
      `:speech_balloon: Canais (${message.guild.channels.filter(
        chn => chn.type === "text"
      ).size +
        message.guild.channels.filter(chn => chn.type === "voice").size})`,
      `:pencil: **Texto: ${
        message.guild.channels.filter(chn => chn.type === "text").size
      }** \n :speaking_head: **Voz: ${
        message.guild.channels.filter(chn => chn.type === "voice").size
      }**`,
      false
    )
    .addField(
      `:busts_in_silhouette: Membros (${message.guild.members.size})`,
      `${status["online"]}: ${
        message.guild.members.filter(m => m.presence.status === "online").size
      }|${status["idle"]}: ${
        message.guild.members.filter(m => m.presence.status === "away").size
      }|${status["dnd"]}: ${
        message.guild.members.filter(m => m.presence.status === "dnd").size
      }|${status["offline"]}: ${
        message.guild.members.filter(m => m.presence.status === "offline").size
      }\n 
    :raising_hand: Pessoas: ${
      message.guild.members.filter(m => !m.user.bot).size
    }\n 
    :robot: Bots: ${message.guild.members.filter(m => m.user.bot).size}`,
      false
    )
    .setFooter("Bot Criado pelo Lobo Metalúrgico", aruna.user.avatarURL)
    .setTimestamp();

  message.reply(embed);
};

exports.config = {
  name: "serverinfo",
  aliases: ["si"],
  category: `${emoji.robot} Utilidades`
};
