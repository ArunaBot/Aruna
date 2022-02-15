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

const { utils, emoji } = require('../Utils');
const Discord = require('discord.js');
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc) => {
  const apiURL = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=';
  if (langc) {
    language = langc;
  }

  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setDescription(language.tts.embed.error.description.replace('%s', args.join(' ').length))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setTimestamp();

  if (args.join(' ').length > 255 || args.join(' ').length < 1) {
    message.channel.send(error1);
    return;
  }

  const text = encodeURIComponent(args.join(' ')).toString();

  try {
    const file = await utils.downloadFile(apiURL + text);

    const attachment = new Discord.Attachment(file);

    const sucess = new Discord.RichEmbed()
      .setAuthor(language.generic.embed.sucess.title.replace('[username]', message.member.displayName), message.author.avatarURL)
      .setDescription(language.tts.embed.success.description)
      .setFooter(language.generic.embed.sucess.footer.replace('[username]', message.member.displayName))
      .attachFile(attachment)
      .setTimestamp();

    message.channel.send(sucess);
  } catch (err) {
    const errorG = new Discord.RichEmbed()
      .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
      .setDescription(language.generic.embed.error.description)
      .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
      .setTimestamp();
    message.channel.send(errorG);
    console.log(err);
  }
};

exports.config = {
  name: 'tts',
  aliases: ['text-to-speech', 'texttospeech'],
  category: `${emoji.robot} Utilidades`,
  description: language.tts.config.description,
  public: true
};
