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
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);
const { emoji } = require('../Utils');

exports.run = async (aruna, message, args, langc) => {

  if (langc) {
    language = langc;
  }

  const embed = new Discord.RichEmbed(message.author);

  const error = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setColor([255, 0, 0])
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.help.embed.error.description)
    .setTimestamp();
  const sucess = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(language.generic.embed.sucess.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
    .setDescription(language.help.embed.sucess.description)
    .setTimestamp();

  const guildDB = await database.Guilds.findOne({ _id: message.guild.id });
  const userDB = await database.Users.findOne({ _id: message.author.id });

  var prefix = guildDB.prefix;

  var categories;

  if (!userDB.SUPER) {
    categories = aruna.commands
      .map(c => c.config.category)
      .filter((v, i, a) => a.indexOf(v) === i);
    categories
      .sort((a, b) => a.localeCompare(b))
      .forEach(category => {
        const commands = aruna.commands
          .filter(c => c.config.category === category && c.config.public === true)
          .sort((a, b) => a.config.name.localeCompare(b.config.name))
          .map(c => prefix + c.config.name)
          .join(', ');
        if (category == '🧰 Administração') {
          null;
        } else {
          embed.addField(`${category}`, '```' + commands + '```', false);
        }
      });
  } else {
    categories = aruna.commands
      .map(c => c.config.category)
      .filter((v, i, a) => a.indexOf(v) === i);
    categories
      .sort((a, b) => a.localeCompare(b))
      .forEach(category => {
        const commands = aruna.commands
          .filter(c => c.config.category === category)
          .sort((a, b) => a.config.name.localeCompare(b.config.name))
          .map(c => prefix + c.config.name)
          .join(', ');
        embed.addField(`${category}`, '```' + commands + '```', false);
      });
  }

  embed.setColor('#004080');
  embed.setAuthor(aruna.user.username, aruna.user.displayAvatarURL);
  embed.setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag), message.author.avatarURL);
  embed.setTimestamp();

  message.author.send(embed).then(() => {
    message.channel.send(sucess);
  }).catch(() => {
    message.channel.send(error);
  });
};

exports.config = {
  name: 'help',
  aliases: ['ajuda', 'comandos', 'commands', 'comando', 'command'],
  category: `${emoji.robot} Utilidades`,
  description: language.help.config.description,
  public: true
};
