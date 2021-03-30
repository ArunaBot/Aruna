/* eslint-disable max-len */
/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2021

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

const { emoji } = require('../Utils');
const { config, links } = require('../../Configs');
const Discord = require('discord.js');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc) => {
  if (langc) {
    language = langc;
  }

  const error = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setDescription(language.invite.embed.error.description)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setTimestamp();

  if (!links.invites[0]) {
    return message.channel.send(error);
  }

  const embed = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setDescription(`${language.invite.embed.sucess.description.line1}
\n${language.invite.embed.sucess.description.line2.replace('[link]', links.invites[0])}
\n${language.invite.embed.sucess.description.line3}`)
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
    .setTimestamp();
  message.channel.send(embed);
};

exports.config = {
  name: 'invite',
  aliases: ['convidar', 'convite'],
  description: language.invite.config.description,
  category: `${emoji.robot} Utilidades`,
  public: true
};
