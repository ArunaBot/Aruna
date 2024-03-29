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

const Discord = require('discord.js');
const chalk = require('chalk');
const { database, config, links } = require('../../Configs');
const { checkInvites, cooldown, utils } = require('../Utils');
const langI = require(`../../languages/bot/${config.language}/internal.json`);

exports.run = async (aruna, message) => {
  if (message.channel.type == 'dm') {
    const dmUser = await database.Users.findOne({ _id: message.author.id });

    if (dmUser.language && dmUser.language.length === 2) {
      switch (dmUser.language) {
        case 'en':
          dmUser.language = 'en-US';
          break;
        case 'pt':
        case 'br':
          dmUser.language = 'pt-BR';
          break;
        case 'es':
          dmUser.language = 'es-ES';
          break;
        default:
          dmUser.language = null;
          break;
      }

      await database.Users.updateOne({ _id: message.author.id }, { $set: { language: dmUser.language } });
      debug(`User ${message.author.tag} Updated!`);
    }

    const dmLang = require(`../../languages/bot/${dmUser.language || config.defaultLanguage}/events.json`);

    if (message.author.bot) return;
    return message.reply(dmLang.message.errors.dmError);
  }
  
  var guild = await database.Guilds.findOne({ _id: message.guild.id });
  var user = await database.Users.findOne({ _id: message.author.id });
  
  if (!guild) {
    var language;
    if (message.guild.region == 'brazil') {
      language = 'pt-BR';
    } else {
      language = config.defaultLanguage;
    }

    debug('No Guild!');

    var saveG = new database.Guilds({
      _id: message.guild.id,
      language: language
    });

    await saveG.save();

    guild = await database.Guilds.findOne({ _id: message.guild.id });
  }
  
  if (!user) {
    debug('No User!');

    var isSuper = false;

    if (config.superUsersId.includes(message.author.id)) {
      isSuper = true;
    }

    var saveU = new database.Users({ _id: message.author.id, SUPER: isSuper });

    await saveU.save();

    user = await database.Users.findOne({ _id: message.author.id });
  }
  
  var prefix = guild.prefix || config.prefix;

  if (config.forcePrefix) {
    prefix = config.prefix;
  }

  // Backward Compatibility with old language config system

  if (guild.language && guild.language.length === 2) {
    switch (guild.language) {
      case 'en':
        guild.language = 'en-US';
        break;
      case 'pt':
      case 'br':
        guild.language = 'pt-BR';
        break;
      case 'es':
        guild.language = 'es-ES';
        break;
      default:
        guild.language = config.defaultLanguage;
        break;
    }

    await database.Guilds.updateOne({ _id: message.guild.id }, { $set: { language: guild.language } });
    
    debug(`Guild ${message.guild.name} Updated!`);
  }

  if (user.language && user.language.length === 2) {
    switch (user.language) {
      case 'en':
        user.language = 'en-US';
        break;
      case 'pt':
      case 'br':
        user.language = 'pt-BR';
        break;
      case 'es':
        user.language = 'es-ES';
        break;
      default:
        user.language = null;
        break;
    }

    await database.Users.updateOne({ _id: message.author.id }, { $set: { language: user.language } });

    debug(`User ${message.author.tag} Updated!`);
  }

  // End of Backward Compatibility
  
  if (user.language !== guild.language && user.language !== null) {
    language = user.language;
  } else {
    language = language || guild.language;
  }
  
  const lang = require(`../../languages/bot/${language || config.defaultLanguage}/events.json`);
  const langc = require(`../../languages/bot/${language || config.defaultLanguage}/commands.json`);

  if (await checkInvites.check(aruna, message, lang, guild, database, debug)) return;
  
  if (message.author.bot) return;

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

  if (guild.rankEnable) {
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

      await saveR.save();
    }

    const xpsystem = require('../utils/rankSystem.js');
    await xpsystem.run(aruna, message, lang, langc, database, cooldown, utils, Discord);
  }

  if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
    if (message.content.toLowerCase() === prefix.toLowerCase()) return;

    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const ma = message.content.split(' ');
    const cmd = ma[0];
    if (cmd.toLowerCase() == prefix.toLowerCase() || cmd.slice(prefix.length).length < 2) return;
    const commandFile =
          aruna.commands.get(cmd.slice(prefix.length).toLowerCase()) ||
          aruna.commands.get(aruna.aliases.get(cmd.slice(prefix.length).toLowerCase()));

    if (commandFile) {
      if (!message.guild.members.get(aruna.user.id).hasPermission('USE_EXTERNAL_EMOJIS')) {
        return message.reply(emojiError);
      } else if (!message.guild.members.get(aruna.user.id).hasPermission('EMBED_LINKS')) {
        return message.reply(linkError);
      } else if (!user.SUPER && !commandFile.config.public) {
        const denied = new Discord.RichEmbed()
          .setAuthor(langc.generic.embed.denied.title, message.author.avatarURL)
          .setDescription(`${langc.generic.embed.denied.description.line1.replace('[username]', message.member.displayName).replace('[command]', command)}\n
          ${langc.generic.embed.denied.description.line2.replace('[prefix]', prefix)}`)
          .setFooter(langc.generic.embed.denied.footer)
          .setTimestamp();
        return message.channel.send(denied);
      }
      commandFile.run(aruna, message, args, langc, prefix, command);
    } else if (!commandFile) {
      const alts =
            aruna.commands
              .filter(c =>
                c.config.name.startsWith(cmd.slice(prefix.length).toLowerCase())
              )
              .map(a => `${prefix}${a.config.name}`)
              .join(', ') || undefined;

      if (alts !== undefined) {
        message.reply(lang.message.errors.commandNotFound.replace('[command]', command).replace('[alt]', alts)).then(async msg => {
          setTimeout(() => {
            msg.delete();
          }, 30000);
        });
      }
    }
  }
  function logPrefix() {
    return `${chalk.gray('[')}${isSharded() ? `${langI.generic.shard} ${chalk.blue(aruna.shard.id)}` : aruna.user.username}${chalk.gray(']')}`;
  }

  // eslint-disable-next-line no-unused-vars
  function log(...a) {
    return console.log(logPrefix(), ...a);
  }

  // eslint-disable-next-line no-unused-vars
  function warn(...a) {
    return console.warn(logPrefix(), chalk.yellow(...a));
  }

  // eslint-disable-next-line no-unused-vars
  function error(...a) {
    return console.error(logPrefix(), chalk.red(...a));
  }

  function debug(...a) {
    if (config.debug) {
      return console.debug(logPrefix(), chalk.magenta(...a));
    } else return;
  }

  function isSharded() {
    return !!aruna.shard;
  }
};
