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
const db = require("../configs/mongoose.js");
const config = require("../configs/cf.js");
const emoji = require("../utils/emojis.js");

exports.run = async (aruna, message) => {
  const embed = new Discord.RichEmbed(message.author);

  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setColor([255, 0, 0])
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Verifique se tenho permissão para lhe enviar mensagens no privado pois, é por lá que envio os comandos.`
    )
    .setTimestamp();
  const sucesso = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Comandos Enviados`)
    .setDescription(
      `Os comandos foram enviados em seu privado com sucesso!`
    )
    .setTimestamp();

  let guildDB = await db.Guilds.findOne({ _id: message.guild.id });

  const categories = aruna.commands
    .map(c => c.config.category)
    .filter((v, i, a) => a.indexOf(v) === i);
  categories
    .sort((a, b) => a.localeCompare(b))
    .forEach(category => {
      const commands = aruna.commands
        .filter(c => c.config.category === category)
        .sort((a, b) => a.config.name.localeCompare(b.config.name))
        .map(c => guildDB.prefix + c.config.name)
        .join(", ");
      embed.addField(`${category}`, "```" + commands + "```", false);
      embed.setColor("#004080");
      embed.setAuthor(
        `${aruna.user.username}`,
        `${aruna.user.displayAvatarURL}`
      );
      embed.setFooter("Desenvolvida por Lobo Metalurgico#7237");
      embed.setTimestamp();
    });

  message.channel.send(sucesso).then(msg => {
    message.author.send(embed).catch(err => {
      msg.edit(error1);
    });
  });
};

exports.config = {
  name: "help",
  aliases: ["ajuda", "comandos", "commands"],
  category: `${emoji.robot} Utilidades`
};
