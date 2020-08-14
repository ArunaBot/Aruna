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
var { database, config, links } = require('../../Configs');
const { cooldown, utils } = require('../Utils');

exports.run = async (aruna, message) => {
  if (message.author.bot) return;

  if (message.channel.type == 'dm') {
    const dmUser = await database.Users.findOne({ _id: message.author.id });
    const defaultDmEventL = require('../../languages/bot/br/internal.json');
    if (!dmUser) {
      return message.reply(defaultDmEventL.message.errors.dmError);
    } else {
      var dmEventL;
      if (dmUser.language == null) {
        dmEventL = defaultDmEventL;
      } else {
        dmEventL = require(`../../languages/bot/${dmUser.language}/internal.json`);
      }
      return message.reply(dmEventL.message.errors.dmError);
    }
  }

  var guild = await database.Guilds.findOne({ _id: message.guild.id });
  var user = await database.Users.findOne({ _id: message.author.id });
  if (!guild) {
    var language = '';
    if (message.guild.region == 'brazil') {
      language = 'br';
    } else {
      language = config.defaultLanguage;
    }
    console.log('No Server!');
    var saveG = await new database.Guilds({
      _id: message.guild.id,
      language: language
    });
    await saveG.save();
    guild = await database.Guilds.findOne({ _id: message.guild.id });
  }

  if (!user) {
    console.log('No User!');
    var isSuper = false;
    if (config.superUsersId.includes(message.author.id)) {
      isSuper = true;
    }
    var saveU = await new database.Users({ _id: message.author.id, SUPER: isSuper });
    await saveU.save();
    user = await database.Users.findOne({ _id: message.author.id });
  }

  var prefix = guild.prefix || config.prefix;

  if (user.language !== guild.language && user.language !== null) {
    language = user.language;
  } else {
    language = language || guild.language;
  }

      
  const lang = require(`../../languages/bot/${language}/events.json`);
  const langc = require(`../../languages/bot/${language}/commands.json`);

  const emojiError = lang.message.errors.emojiError.replace('[externalEmojis]', langc.generic.permissions.useExternalEmojis);
  const linkError = lang.message.errors.linkError.replace('[sendLinks]', langc.generic.permissions.embedLinks);

  const mention = [`<@${aruna.user.id}>`, `<@!${aruna.user.id}>`];

  mention.find(mention => {
    if (message.content === mention) {
      if (!message.guild.members.get(aruna.user.id).hasPermission('USE_EXTERNAL_EMOJIS')) {
        return message.reply(emojiError);
      } else if (!message.guild.members.get(aruna.user.id).hasPermission('EMBED_LINKS')) {
        return message.reply(linkError);
      }
      const embed = new Discord.RichEmbed()
        .setTitle(lang.message.mention.title)
        .setDescription(
          `${lang.message.mention.line1.replace('[username]', message.author.username).replace('[me]', aruna.user.username)}\n
              ${lang.message.mention.line2}\n
              ${lang.message.mention.line3.replace('[prefix]', prefix)}\n\n
              ${lang.message.mention.line4.replace('[url]', links.supportServers[0])}\n\n
              ${lang.message.mention.line5.replace('[url]', links.invites[0])}\n\n
              ${lang.message.mention.line6}`
        )
        .setColor('#8400ff')
        .setTimestamp();
      return message.channel.send(embed);
    }
  });

  if (guild.rankEnable === true) {
    const rank = await database.Rank.findOne({
      _id: `${message.author.id}-${message.guild.id}`
    });

    if (!rank) {
      var saveR = new database.Rank({
        _id: `${message.author.id}-${message.guild.id}`,
        user: message.author.id,
        xp: 0,
        level: 0,
        guild: message.guild.id
      });

      saveR.save();
    }
    const db = database;

    const xpsystem = require('../utils/rankSystem.js');
    xpsystem.run(aruna, message, lang, langc, db, cooldown, utils, Discord);
  }

  if (message.content.startsWith(prefix)) {
    if (message.content === prefix) return;

    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const ma = message.content.split(' ');
    const cmd = ma[0];
    if (cmd == prefix) return;
    const commandFile =
          aruna.commands.get(cmd.slice(prefix.length).toLowerCase()) ||
          aruna.commands.get(aruna.aliases.get(cmd.slice(prefix.length).toLowerCase()));

    if (commandFile) {
      if (!message.guild.members.get(aruna.user.id).hasPermission('USE_EXTERNAL_EMOJIS')) {
        return message.reply(emojiError);
      } else if (!message.guild.members.get(aruna.user.id).hasPermission('EMBED_LINKS')) {
        return message.reply(linkError);
      }
      commandFile.run(aruna, message, args, langc, prefix, command);
    } else if (!commandFile) {
      const alts =
            aruna.commands
              .filter(c =>
                c.config.name.startsWith(cmd.slice(prefix.length).toLowerCase())
              )
              .map(a => '`' + a.config.name + '`')
              .join(', ') || undefined;

      if (alts !== undefined) {
        message.reply(lang.message.commandNotFound.replace('[command]', command).replace('[alt]', alts));
      }
    }
  }
};
