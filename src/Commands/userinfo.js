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

  var mentionedUser = message.guild.member(
    message.mentions.users.first() ||
    aruna.users.get(args[0])
  ) || aruna.users.get(args[0]);

  if (!args[0]) {
    mentionedUser = message.member;
  }

  if (!mentionedUser || !mentionedUser.user) {
    const fEmbed = new Discord.RichEmbed()
      .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL)
      .setDescription(language.userinfo.embed.error.description.replace('%s', args[0]))
      .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
      .setTimestamp();

    return message.channel.send(fEmbed);
  }
      

  if (mentionedUser.user === aruna.user) {
    return require('./bot').run(aruna, message, args, langc);
  }

  const userNickName = mentionedUser.nickname !== null ? mentionedUser.nickname : language.userinfo.strings.nickname;

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
      break;
  }
    
  let userAdminServer;

  mentionedUser.hasPermission('ADMINISTRATOR') ? userAdminServer = language.generic.strings.yes : userAdminServer = language.generic.strings.no;

  let userAvatar = mentionedUser.user.displayAvatarURL;

  if (userAvatar.endsWith('.gif')) {
    userAvatar = `${mentionedUser.user.displayAvatarURL}?size=2048`;
  } else if (userAvatar.endsWith('.jpg')) {
    userAvatar = mentionedUser.user.displayAvatarURL.replace('.jpg', '.png');
  }

  var stringtime1;
  switch (userDaysDiscord) {
    case 1:
      stringtime1 = language.generic.strings.day;
      break;
    default:
      stringtime1 = language.generic.strings.days;
      break;
  }

  var stringtime2;
  switch (userDaysGuild) {
    case 1:
      stringtime2 = language.generic.strings.day;
      break;
    default:
      stringtime2 = language.generic.strings.days;
      break;
  }

  var userBoost = '';

  const premium = message.guild.member(mentionedUser.user).premiumSinceTimestamp;
  
  if (premium !== null) {
    userBoost = `\n\n(${emoji.nitro}) **${language.userinfo.strings.boosting}** ${dateFormat(message.guild.member(message.author).premiumSinceTimestamp, language.generic.strings.date)}`;
  }

  const accountCreated = dateFormat(mentionedUser.user.createdTimestamp, language.generic.strings.date);
  const joinedIn = dateFormat(mentionedUser.joinedTimestamp, language.generic.strings.date);
  
  const embed = new Discord.RichEmbed()
    .setAuthor(mentionedUser.user.username, userAvatar)
    .addField(language.userinfo.embed.sucess.field.title[0], 
      `🙋 **${language.userinfo.embed.sucess.field.description[0][0]}** \`${mentionedUser.user.username}\`

    ${emoji.menu} **${language.userinfo.embed.sucess.field.description[0][1]}** \`${mentionedUser.user.tag}\`

    **${language.userinfo.embed.sucess.field.description[0][2]}** \`${mentionedUser.user.id}\`

    ${userStatusEmoji} **${language.userinfo.embed.sucess.field.description[0][3]}** \`${userStatus}\`

    ${emoji.pass} **${language.userinfo.embed.sucess.field.description[0][4]}** \`${accountCreated}\` (${userDaysDiscord} ${stringtime1} ${language.generic.strings.back.toLowerCase()})`, false)
    .addField(language.userinfo.embed.sucess.field.title[1],
      `(${emoji.discord}) **${language.userinfo.embed.sucess.field.description[1][0]}** \`${userNickName}\`

    (👮) **${language.userinfo.embed.sucess.field.description[1][1]}** \`${userAdminServer}\`
    
    (:date:) **${language.userinfo.embed.sucess.field.description[1][2]}** \`${joinedIn}\` (${userDaysGuild} ${stringtime2} ${language.generic.strings.back.toLowerCase()})${userBoost}`, false)
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag))
    .setThumbnail(userAvatar)
    .setColor('#012778')
    .setTimestamp();
  
  message.channel.send(embed);
};
exports.config = {
  name: 'userinfo',
  aliases: [],
  category: `${emoji.robot} Utilidades`,
  description: language.userinfo.config.description,
  public: true
};
