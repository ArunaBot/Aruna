/* eslint-disable no-unused-vars */
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
const { database, config } = require('../../Configs');
const { emojis } = require('../Utils');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc, prefix, comando) => {

  if (langc) {
    language = langc;
  }

  const util = require('util');
  const code = args.join(' ');
  const embed = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.eval.embed.error.description1)
    .setTimestamp();
  
  if (!code) return message.channel.send(embed);
  
  try {
    var str;

    if (code.includes(`${aruna.token}` || `${config.token}` || `${config.mongoose}` || 'aruna.token' || 'process.env.token' || 'config.token' || 'config.mongoose')) {
      str = language.eval.generic.censor;
    } else {
      const ev = await eval(code);
      str = util.inspect(ev, { depth: 1 });
      str = `${str.replace(
        new RegExp(`${config.token}|${config.mongoose}`, 'gi'),
        language.eval.generic.censor
      )}`;
    }

    if (str.length > 1012) {
      str = str.substring(0, 1012) + '...';
    }

    const embed = new Discord.RichEmbed()
      .setAuthor(language.eval.embed.sucess.title)
      .addField(
        language.eval.embed.sucess.fields[0].name.replace('%s', emojis.upload),
        `\`\`\`js\n${code}\`\`\``
      )
      .addField(
        language.eval.embed.sucess.fields[1].name.replace('%s', emojis.dev),
        `\`\`\`js\n${str}\`\`\``
      )
      .setColor([54, 57, 63]);
    message.channel.send(embed);
  } catch (err) {
    message.channel.send(err.stack, { code: 'js' });
  }
};

exports.config = {
  name: 'eval',
  aliases: ['ev'],
  description: language.eval.config.description,
  category: '🧰 Administração',
  public: false
};
