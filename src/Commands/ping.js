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
const { emoji } = require("../Utils");

exports.run = async (aruna, message) => {
  let embed = new Discord.RichEmbed()
    .setAuthor(`${aruna.user.username}`, `${aruna.user.displayAvatarURL}`)
    .setColor("#f5ebeb")
    .setDescription(`Calculando...`);

  message.channel.send(embed).then(async msg => {
    let latencia = Math.round(message.createdTimestamp);
    let api = Math.round(aruna.ping);
    //let heartbeat = Date.now() - message.createdTimestamp;
    let embed2 = new Discord.RichEmbed().setColor("#33def5")
      .setDescription(`:hourglass: | Tempo de resposta: **${msg.createdTimestamp - message.createdTimestamp}** ms
      :satellite: | Api: **${api}** ms`);
    msg.edit(embed2);
  });
};
exports.config = {
  name: "ping",
  aliases: ["pong"],
  category: `${emoji.robot} Utilidades`
};
