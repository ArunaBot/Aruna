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
const { emoji } = require('../Utils');
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc) => {
  if (langc) {
    language = langc;
  }

  const embed = new Discord.RichEmbed()
    .setTitle(language.ping.embed['1'].title.replace('[emoji]', emoji.loading).replace('[username]', message.author.username))
    .setColor('#f5ebeb')
    .setDescription(language.ping.embed['1'].description)
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
    .setTimestamp();

  message.channel.send(embed).then(async msg => {
    const apiTime = Math.round(aruna.ping);
    const responseTime = msg.createdTimestamp - message.createdTimestamp;
    const embed2 = new Discord.RichEmbed()
      .setAuthor(aruna.user.username, aruna.user.displayAvatarURL)
      .setColor('#33def5')
      .setDescription(`${language.ping.embed['2'].description.line1.replace('[responseTime]', responseTime)}
      ${language.ping.embed['2'].description.line2.replace('[apiTime]', apiTime)}`)
      .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
      .setTimestamp();
    msg.edit(embed2);
  });
};
exports.config = {
  name: 'ping',
  description: language.ping.config.description,
  aliases: ['pong'],
  category: `${emoji.robot} Utilidades`
};
