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

// eslint-disable-next-line no-unused-vars
const { emoji, date } = require('../Utils');
const Discord = require('discord.js');
const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);
const dateFormat = require('dateformat');

exports.run = (aruna, message, args, langc) => {
  if (langc) {
    language = langc;
  }

  const mentionedUser = message.guild.member(
    message.mentions.users.first() ||
      aruna.users.get(args[0]) ||
      message.author
  );

  const userNickName =
    mentionedUser.nickname !== null
      ? `${mentionedUser.nickname}`
      : 'Sem apelido';
  const userDaysDiscord = Math.round(
    Math.abs(
      (mentionedUser.user.createdAt.getTime() - new Date().getTime()) /
        (24 * 60 * 60 * 1000)
    )
  );
  const userDaysGuild = Math.round(
    Math.abs(
      (mentionedUser.joinedAt.getTime() - new Date().getTime()) /
        (24 * 60 * 60 * 1000)
    )
  );
  var userStatus;
  var userStatusEmoji;

  switch (mentionedUser.presence.status) {
    case 'online':
      userStatus = language.generic.status.online;
      userStatusEmoji = emoji.online;
      break;
    case 'idle':
      userStatus = language.generic.status.idle;
      userStatusEmoji = emoji.idle;
      break;
    case 'dnd':
      userStatus = language.generic.status.dnd;
      userStatusEmoji = emoji.dnd;
      break;
    case 'offline':
      userStatus = language.generic.status.offline;
      userStatusEmoji = emoji.offline;
      break;
    default:
      userStatus = undefined;
  }
    
  let userAdminServer;
  if (mentionedUser.hasPermission('ADMINISTRATOR') === true)
    userAdminServer = 'Sim';
  if (mentionedUser.hasPermission('ADMINISTRATOR') === false)
    userAdminServer = 'Não';

  let userAvatar = mentionedUser.user.displayAvatarURL;
  if (userAvatar.endsWith('.gif')) {
    userAvatar = `${mentionedUser.user.displayAvatarURL}?size=2048`;
  }

  var stringtime1;
  switch (userDaysDiscord) {
    case 1:
      stringtime1 = language.userinfo.generic.days;
      break;
    default:
      stringtime1 = language.userinfo.generic.day;
      break;
  }

  var stringtime2;
  switch (userDaysGuild) {
    case 1:
      stringtime2 = language.userinfo.generic.days;
      break;
    default:
      stringtime2 = language.userinfo.generic.day;
      break;
  }

  var userBoost = '';

  const premium = message.guild.member(mentionedUser.user).premiumSinceTimestamp;
  
  if (premium !== null) {
    userBoost = `\n\n(${emoji.nitro}) **Impulsionando Desde:** ${dateFormat(message.guild.member(message.author).premiumSinceTimestamp, 'dd/mm/yyyy "às" HH:MM:ss')}`;
  }

  const accountCreated = dateFormat(mentionedUser.user.createdTimestamp, 'dd/mm/yyyy "às" HH:MM:ss');
  const joinedIn = dateFormat(mentionedUser.joinedTimestamp, 'dd/mm/yyyy "às" HH:MM:ss');
  
  const embed = new Discord.RichEmbed()
    .setAuthor(`${mentionedUser.user.username}`, `${userAvatar}`)
    .addField('Informações do Usuário', `
    🙋 **Nome:** \`${mentionedUser.user.username}\`

    ${emoji.menu} **Tag Completa:** \`${mentionedUser.user.tag}\`

    **Id:** \`${mentionedUser.user.id}\`

    ${userStatusEmoji} **Status:** \`${userStatus}\`

    ${emoji.pass} **Criou a Conta Em:** \`${accountCreated}\` (${userDaysDiscord} ${stringtime1} atrás)`, false)
    .addField('Informações do Membro', `
    (${emoji.discord}) **Apelido:** \`${userNickName}\`

    (👮) **É Administrador:** \`${userAdminServer}\`
    
    (:date:) **Entrou Em:** \`${joinedIn}\` (${userDaysGuild} ${stringtime2} atrás)${userBoost}
    `, false)
    .setFooter(language.generic.embed.footer2.replace('[usertag]', message.author.tag))
    .setThumbnail(userAvatar)
    .setColor('#56eaf5')
    .setTimestamp();
  
  message.channel.send(embed);
};
exports.config = {
  name: 'userinfo',
  aliases: [],
  category: `${emoji.robot} Utilidades`,
  public: true
};
