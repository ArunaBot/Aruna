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

const { emojis } = require('../Utils');
const Discord = require('discord.js');
const math = require('mathjs');
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = (aruna, message, args, langc) => {

  if (langc) {
    language = langc;
  }

  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.calculator.embed.error.description1)
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.calculator.embed.error.description2)
    .setTimestamp();

  if (!args[0]) return message.channel.send(error1);

  var response;

  try {
    response = math.evaluate(args.join(' '));
  } catch (e) {
    console.error(e);
    return message.channel.send(error2);
  }
  
  const embed = new Discord.RichEmbed()
    .setTitle(language.calculator.embed.sucess.title)
    .addField(language.calculator.embed.sucess.field1.replace('[emoji]', emojis.upload),
      `\`\`\`js\n${args.join(' ')}\`\`\``
    )
    .addField(language.calculator.embed.sucess.field2.replace('[emoji]', emojis.dev),
      `\`\`\`js\n${response}\`\`\``
    )
    .setColor([54, 57, 63]);
  message.channel.send(embed);
};

exports.config = {
  name: 'calc',
  description: language.calculator.config.description,
  aliases: ['calculadora', 'math', 'matematica', 'calcular', 'calculator'],
  category: `${emojis.robot} Utilidades`,
  public: true
};
