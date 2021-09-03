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

const Discord = require('discord.js');
const { emoji } = require('../Utils');
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = (aruna, message, args, langc) => {

  if (langc) {
    language = langc;
  }

  var guildIcon;

  if (message.guild.iconURL.includes('a_')) {
    guildIcon = message.guild.iconURL.slice(0, -3).trim() + 'gif';
  } else {
    guildIcon = message.guild.iconURL;
  }

  const embed = new Discord.RichEmbed()
    .setTitle(language.servericon.embed.title.replace('[emoji]', emoji.picture).replace('[guild]', message.guild.name))
    .setDescription(language.servericon.embed.description.replace('[url]', guildIcon))
    .setImage(guildIcon)
    .setTimestamp();
  message.channel.send(embed);
};

exports.config = {
  name: 'servericon',
  aliases: ['guildicon'],
  description: language.servericon.config.description,
  category: '🎉 Entretenimento',
  public: true
};
