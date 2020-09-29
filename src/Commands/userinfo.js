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
const dateFormat = require('dateformat');

exports.run = (aruna, message, args) => {
  
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
  let userStatus;
  if (mentionedUser.presence.status === 'dnd') userStatus = 'Não Pertube';
  if (mentionedUser.presence.status === 'idle') userStatus = 'Ausente';
  if (mentionedUser.presence.status === 'stream') userStatus = 'Transmitindo';
  if (mentionedUser.presence.status === 'offline') userStatus = 'Offline';
  if (mentionedUser.presence.status === 'online') userStatus = 'Disponível';

  let userStatusEmoji;
  if (mentionedUser.presence.status === 'dnd') userStatusEmoji = emoji.dnd;
  if (mentionedUser.presence.status === 'idle') userStatusEmoji = emoji.idle;
  if (mentionedUser.presence.status === 'stream')
    userStatusEmoji = emoji.stream;
  if (mentionedUser.presence.status === 'offline')
    userStatusEmoji = emoji.offline;
  if (mentionedUser.presence.status === 'online')
    userStatusEmoji = emoji.online;

  let userAdminServer;
  if (mentionedUser.hasPermission('ADMINISTRATOR') === true)
    userAdminServer = 'Sim';
  if (mentionedUser.hasPermission('ADMINISTRATOR') === false)
    userAdminServer = 'Não';

  let userAvatar = mentionedUser.user.displayAvatarURL;
  if (userAvatar.endsWith('.gif')) {
    userAvatar = `${mentionedUser.user.displayAvatarURL}?size=2048`;
  }

  var stringtime1 = '';
  if (userDaysDiscord == 1) stringtime1 = 'dia';
  else stringtime1 = 'dias';

  var stringtime2 = '';
  if (userDaysGuild == 1) stringtime2 = 'dia';
  else stringtime2 = 'dias';

  const premium = message.guild.member(message.author).premiumSinceTimestamp;
  var userBoost = '';
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
    .setFooter(`Informações Solicitadas por ${message.author.tag}`, message.author.avatarURL)
    .setThumbnail(userAvatar)
    .setColor('#56eaf5')
    .setTimestamp();

  /* let embed2 = new Discord.RichEmbed()
    .setAuthor(`${mentionedUser.user.username}`, `${userAvatar}`)
    .addField(`(${emoji.passport}) Permissões`, `${userPerms}`)
    .setFooter("Criada pelo Lobo Metalurgico")
    .setThumbnail(userAvatar)
    .setColor("#56eaf5")
    .setTimestamp();*/
  
  message.channel.send(embed);
    
  /* .then(msg => {
    msg.react("638067652337729597");
    const collector = msg.createReactionCollector(
      (r, u) =>
        r.emoji.name === "passport" &&
        (u.id !== aruna.user.id && u.id === message.author.id)
    );
    collector.on("collect", r => {
      switch (r.emoji.name) {
        case "passport":
          msg.edit(embed2).then(msg2 => {
            msg2.react("⬅");
            const collector2 = msg.createReactionCollector(
              (r, u) =>
                r.emoji.name === "⬅" &&
                (u.id !== aruna.user.id && u.id === message.author.id)
            );
            collector2.on("collect", r => {
              switch (r.emoji.name) {
                case "⬅":
                  msg.edit(embed);
              }
            });
          });
      }
    });
  });*/
};
exports.config = {
  name: 'userinfo',
  aliases: ['ui'],
  category: `${emoji.robot} Utilidades`,
  public: true
};
