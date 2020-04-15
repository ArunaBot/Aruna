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

const Discord = require("discord.js");
const db = require("../configs/mongoose.js");
const utils = require("../utils/utils.js");

exports.run = async (aruna, message, args) => {
  const user = await db.Users.findOne({ _id: message.author.id });
  const guild = await db.Guilds.findOne({ _id: message.guild.id });

  const error = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Este comando não está ativado em seu servidor. Por favor, solicite a um ADM que ative-o usando o comando \`\`${guild.prefix}config\`\`.`
    )
    .setTimestamp();

  if (guild.rankEnable !== true) return message.channel.send(error);

  var userid = message.guild.member(
    message.mentions.users.first() ||
      message.guild.members.get(args[0]) ||
      message.author.id
  );

  const rank = await db.Rank.findOne({
    user: userid.id,
    guild: message.guild.id
  });

  let xp = rank.xp;
  if (xp === null) xp = 0;
  let level = rank.level;
  if (level === null) level = 0;

  const embed2 = new Discord.RichEmbed()
    .setColor([54, 57, 63])
    .setAuthor("RANK: " + userid.user.username, userid.user.avatarURL)
    .addField("Nível", level, true)
    .addField("Xp Atual", xp, true)
    .setTimestamp();

  let need = utils.need(level);

  const embed = new Discord.RichEmbed()
    .setColor([54, 57, 63])
    .setAuthor("RANK: " + userid.user.username, userid.user.avatarURL)
    .addField("Nível", level, true)
    .addField("Xp Atual", xp, true)
    .addField("XP Necessário", need, true)
    .setTimestamp();
  message.channel.send(embed);
};

exports.config = {
  name: "rank",
  aliases: ["perfil"],
  category: `🎉 Entretenimento`
};
