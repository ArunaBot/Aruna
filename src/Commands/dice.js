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
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc, prefix, comando) => {
  if (langc) {
    language = langc;
  }
  const error1 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description1)
    .setTimestamp();

  const error2 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description2)
    .setTimestamp();

  const error3 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description3)
    .setTimestamp();

  const error4 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description4)
    .setTimestamp();

  const error5 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description5)
    .setTimestamp();
  
  const error6 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description6)
    .setTimestamp();
  
  const error7 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description7)
    .setTimestamp();

  if (!args[0]) return message.channel.send(error5);

  const split = message.content
    .slice(comando.length + prefix.length)
    .trim()
    .split('d' || 'D' || ' ');

  if (!split) return message.channel.send(error5);

  var number = split[0];

  if (!number) return message.channel.send(error5);

  const dice = split[1];

  if (!dice) return message.channel.send(error1);

  if (dice > 200) return message.channel.send(error2);

  if (number > 50) return message.channel.send(error3);
  
  if (dice == 0) return message.channel.send(error6);
  
  if (number == 0) return message.channel.send(error7);
  
  var diceStr = number == 1 ? language.dice.embed.generic.dice : language.dice.embed.generic.dices;
  
  const error8 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.dice.embed.error.description8.replace(/\[NUMBER\]/g, number).replace('[diceString]', diceStr))
    .setTimestamp();
  
  if (dice == 1) return message.channel.send(error8);

  var result = [];

  var loop = number;
  var embed = new Discord.MessageEmbed()
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
    .setTimestamp();

  var idVar = setInterval(() => {
    if (loop <= 0) {
      if (number > 1) {
        embed.setAuthor(language.dice.embed.sucess['1'].title.replace('[username]', message.member.displayName).replace('[NUMBER]', number).replace('[DICE]', dice),
          message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
          .setDescription(language.dice.embed.sucess['1'].description.replace('[DICES]', result.join(', ')).replace('[TOTAL]', result.reduce((a, b) => a + b)));
      } else {
        embed.setAuthor(language.dice.embed.sucess['2'].title.replace('[username]', message.member.displayName).replace('[DICE]', dice), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
          .setDescription(language.dice.embed.sucess['2'].description.replace('[DICES]', result[0]));
      }
      clearInterval(idVar);
      return message.channel.send(embed);
    }

    loop = loop - 1;

    var math = Math.floor(Math.random() * dice) + 1;

    if (math >= 500) {
      clearInterval(idVar);
      return message.channel.send(error4);
    }

    result.push(math);
  }, 0,1);
};
exports.config = {
  name: 'dice',
  aliases: ['dado', 'roll'],
  description: language.dice.config.description,
  category: '🎉 Entretenimento',
  public: true
};
