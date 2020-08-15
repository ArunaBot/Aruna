/* eslint-disable max-len */
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

const Discord = require('discord.js');
const { config, database } = require('../../Configs');
const { utils } = require('../Utils');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc) => {
  const guild = await database.Guilds.findOne({ _id: message.guild.id });

  if (langc) {
    language = langc;
  }

  const error = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.generic.embed.disabled.replace('[config]', `${guild.prefix}config`))
    .setTimestamp();

  if (guild.rankEnable !== true) return message.channel.send(error);

  var userid = message.guild.member(
    message.mentions.users.first() ||
      message.guild.members.get(args[0]) ||
      message.author.id
  );

  const rank = await database.Rank.findOne({
    user: userid.id,
    guild: message.guild.id
  });

  let xp = rank.xp;
  if (xp === null) xp = 0;
  let level = rank.level;
  if (level === null) level = 0;

  const need = utils.need(level);

  const embed = new Discord.RichEmbed()
    .setColor([54, 57, 63])
    .setAuthor(language.rank.embed.title.replace('[username]', userid.displayName), userid.user.avatarURL)
    .addField(language.rank.embed.field1, level, true)
    .addField(language.rank.embed.field2, xp, true)
    .addField(language.rank.embed.field3, need, true)
    .setFooter(language.generic.footer.replace('[usertag]', message.author.tag))
    .setTimestamp();
  message.channel.send(embed);
};

exports.config = {
  name: 'rank',
  description: language.rank.config.description,
  aliases: ['perfil'],
  category: '🎉 Entretenimento'
};
