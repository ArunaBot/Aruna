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
const { database, config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

/** @deprecated This Will Be Removed In A future Version */
exports.run = async (aruna, message, args, langc) => {
  if (langc) {
    language = langc;
  }
  const guild = await database.Guilds.findOne({ _id: message.guild.id });

  const nopermission = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.prefix.embed.error.noperm.replace('[manageGuild]', language.generic.permissions.manageGuild))
    .setTimestamp();
  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.prefix.embed.error.description1)
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.prefix.embed.error.description2)
    .setTimestamp();
  const error3 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.prefix.embed.error.description3)
    .setTimestamp();
  const prefixRemove = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(language.generic.embed.sucess.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.sucess.footer)
    .setDescription(language.prefix.embed.sucess.description1.replace('[prefix]', config.prefix))
    .setTimestamp();
  const prefixDefinido = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(language.generic.embed.sucess.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.sucess.footer)
    .setDescription(language.prefix.embed.sucess.description2.replace('[prefix]', args[1]))
    .setTimestamp();
  const deprecatedWarn = new Discord.RichEmbed()
    .setTitle(language.generic.embed.deprecated.title)
    .setDescription(`${language.generic.embed.deprecated.description1}\n
    ${language.generic.embed.deprecated.description2.replace('[alternative]', language.prefix.deprecatedAlternative.replace('[prefix]', guild.prefix))}`)
    .setColor('#fcec03')
    .setFooter(language.generic.embed.deprecated.footer)
    .setTimestamp();

  message.channel.send(deprecatedWarn).then(msg => msg.delete(30000));
  if (!message.member.hasPermission('MANAGE_GUILD'))
    return message.channel.send(nopermission);

  if (!args[0]) return message.channel.send(error1);

  if (args[0] !== 'set' && args[0] !== 'remove')
    return message.channel.send(error1);

  if (args[0] === 'remove') {
    if (guild.prefix === config.prefix)
      return message.channel.send(error3);

    guild.prefix = config.prefix;
    guild.save();
    message.channel.send(prefixRemove);
  }

  if (args[0] === 'set') {
    if (!args[1]) return message.channel.send(error2);

    guild.prefix = args[1];
    guild.save();
    message.channel.send(prefixDefinido);
  }
};

exports.config = {
  name: 'prefix',
  description: language.prefix.config.description,
  aliases: ['prefixo', 'pref'],
  category: '⚙️ Configurações',
  public: true
};
