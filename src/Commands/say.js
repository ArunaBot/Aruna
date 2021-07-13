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
const { config } = require('../../Configs');

var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc, prefix, comando) => {
  if (langc) {
    language = langc;
  }

  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setDescription(language.say.embed.error.description1.replace('[manageMessages]', language.generic.permissions.manageMessages))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setDescription(language.say.embed.error.description2.replace('[manageMessages]', language.generic.permissions.manageMessages))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setTimestamp();
  const error3 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setDescription(language.say.embed.error.description3)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setTimestamp();

  if (!message.member.hasPermission('MANAGE_MESSAGES'))
    return message.channel.send(error1);

  if (!message.guild.members.get(aruna.user.id).hasPermission('MANAGE_MESSAGES'))
    return message.channel.send(error2);

  var content = message.content.slice(comando.length + prefix.length).trim();

  if (!content) {
    return message.channel.send(error3);
  }

  await message.delete();
  await message.channel.send(content);
};

exports.config = {
  name: 'say',
  description: language.say.config.description,
  aliases: ['falar'],
  category: '🎉 Entretenimento',
  public: true
};
