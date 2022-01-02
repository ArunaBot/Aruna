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
  var role;
  if (!args[0]) {
    role = undefined;
  } else {
    role =
      message.mentions.roles.first() ||
      message.guild.roles.get(args[0]) ||
      message.guild.roles.find(r =>
        r.name.toLowerCase().includes(args[0].toLowerCase())
      ) ||
      undefined;
  }

  if (langc) {
    language = langc;
  }

  const error1 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.error.description1.replace('[manageRoles]', language.generic.permissions.manageRoles))
    .setTimestamp();

  const error2 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.error.description2.replace('[manageRoles]', language.generic.permissions.manageRoles))
    .setTimestamp();
  
  if (!message.member.hasPermission('MANAGE_ROLES'))
    return message.channel.send(error1);
  if (!message.guild.members.get(aruna.user.id).hasPermission('MANAGE_ROLES'))
    return message.channel.send(error2);
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.error.description3)
    .setTimestamp();
  
  if (!role || role === undefined) return message.channel.send(error3);

  const error4 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.error.description4.replace('[roleName]', role.name))
    .setTimestamp();

  const error5 = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.error.description5.replace('[roleName]', role.name))
    .setTimestamp();
  
  if (role.position >= message.guild.members.get(aruna.user.id).highestRole.position)
    return message.channel.send(error4);

  if (role.position >= message.guild.members.get(message.author.id).highestRole.position 
    && message.guild.owner.id !== message.author.id
  ) return message.channel.send(error5);

  var applyTO = 0;

  if (args[1]) {
    switch (args[1].toLowerCase()) {
      case 'usuários':
      case 'users':
      case 'people':
      case 'pessoas':
        applyTO = 1;
        break;
      case 'bots':
        applyTO = 2;
        break;
      case 'all':
      case 'todos':
      case 'both':
      case 'ambos':
      default:
        applyTO = 0;
        break;
    }
  }
    
  const roleGuild = message.guild;
  var memberArray;

  switch (applyTO) {
    case 1:
      memberArray = roleGuild.members.filter(member => !member.user.bot).array();
      break;
    case 2:
      memberArray = roleGuild.members.filter(member => member.user.bot).array();
      break;
    case 0:
    default:
      memberArray = roleGuild.members.array();
      break;
  }

  const memberCount = memberArray.length;

  const executando = new Discord.RichEmbed()
    .setTitle(language.generic.embed.running.title.replace('[emoji]', emoji.loading)
      .replace('[username]', message.member.displayName), message.author.avatarURL)
    .setColor('#f2ff00')
    .setFooter(language.generic.embed.running.footer.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.running.description.replace('[roleName]', role.name).replace('[userSize]', memberCount))
    .setTimestamp();

  const sucess = new Discord.RichEmbed()
    .setAuthor(language.generic.embed.sucess.title.replace('[username]', message.member.displayName), message.author.avatarURL)
    .setColor([0, 255, 0])
    .setFooter(language.generic.embed.sucess.footer2.replace('[username]', message.member.displayName))
    .setDescription(language.massRole.embed.sucess.description[applyTO].replace('[roleName]', role.name).replace('[userSize]', memberCount))
    .setTimestamp();

  message.channel.send(executando).then(async msg => {
    for (var i = 0; i < memberCount; i++) {
      const member = memberArray[i];
      // eslint-disable-next-line no-await-in-loop
      await member.addRole(role);
      if (memberCount - i <= 1){
        msg.edit(sucess);
      }
    }
  });
};

exports.config = {
  name: 'massrole',
  description: language.massRole.config.description,
  aliases: ['masscargo', 'cargomassivo'],
  category: '👮‍♂️ Moderação',
  public: true
};
