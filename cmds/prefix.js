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

exports.run = async (aruna, message, args) => {
  const server = await db.Guilds.findOne({ _id: message.guild.id });

  const nopermission = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não possui a permissão de \`Gerenciar Servidor\``)
    .setTimestamp();
  const error = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription(
      `Insira se você deseja definir um prefixo (set) ou se deseja voltar ao padrão (remove).`
    )
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir o prefixo desejado!`)
    .setTimestamp();
  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`O prefixo atual já é o prefixo padrão!`)
    .setTimestamp();
  const remove = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Sucesso!`)
    .setDescription(
      `Prefixo redefinido para \`${config.prefix}\` com sucesso!`
    )
    .setTimestamp();
  const definido = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Sucesso!`)
    .setDescription(`Prefixo definido para \`${args[1]}\` com sucesso!`)
    .setTimestamp();

  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.channel.send(nopermission);

  if (!args[0]) return message.channel.send(error);

  if (args[0] !== "set" && args[0] !== "remove")
    return message.channel.send(error);

  if (args[0] === "remove") {
    if (server.prefix === config.prefix)
      return message.channel.send(error3);

    server.prefix = config.prefix;
    server.save();
    message.channel.send(remove);
  }

  if (args[0] === "set") {
    if (!args[1]) return message.channel.send(error2);

    server.prefix = args[1];
    server.save();
    message.channel.send(definido);
  }
};

exports.config = {
  name: "prefix",
  aliases: ["prefixo", "pref"],
  category: `⚙️ Configurações`
};
