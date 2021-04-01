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

function verify(messages, args, message, language) {
  if (args[0] == messages.size) {
    return (language.clear.sucess.message1.replace('[messages]', messages.size).replace('[user]', message.author));
  } else {
    return (language.clear.sucess.message2.replace('[messages]', messages.size).replace('[user]', message.author).replace('[request]', args[0]));
  }
}

const Discord = require('discord.js');
const { config } = require('../../../../Configs');
var language = require(`../../../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (aruna, message, args, langc) => {

  if (langc) {
    language = langc;
  }
  
  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.clear.embed.error.description1.replace('[manageMessages]', language.generic.permissions.manageMessages))
    .setTimestamp();
  
  const error2 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.clear.embed.error.description2.replace('[manageMessages]', language.generic.permissions.manageMessages))
    .setTimestamp();
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.clear.embed.error.description3)
    .setTimestamp();
  
  const error4 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.clear.embed.error.description4)
    .setTimestamp();
  
  if (!message.member.hasPermission('MANAGE_MESSAGES'))
    return message.channel.send(error1);
  if (!message.guild.members.get(aruna.user.id).hasPermission('MANAGE_MESSAGES'))
    return message.channel.send(error2);

  if (!args[0])
    return message.channel.send(error3);
    
  if (args[0] > 100 || args[0] <= 1)
    return message.channel.send(error4);
  
  await message.delete().then(async () => {
    await message.channel.fetchMessages({ limit: args[0] }).then(async messages => {
      await message.channel.bulkDelete(messages, true).then(async msgs => {
        await message.channel.send(verify(msgs, args, message, language)).then(async msg => {
          await msg.delete(10000);
        });
      });
    });
  });
};
exports.config = {
  name: 'clear',
  description: language.clear.config.description,
  aliases: ['limpar'],
  category: '👮‍♂️ Moderação',
  public: true
};
