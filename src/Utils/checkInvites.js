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

async function check (aruna, message, lang, guildDB, database, debug) {
  if (!guildDB.antiInviteEnable) return false;

  const guild = message.guild;
  const member = message.member;
  const channel = message.channel;

  var AIDB = await database.AntiInvite.findOne({ _id: guild.id });

  if (!AIDB) {
    AIDB = new database.AntiInvite({
      _id: guild.id
    });

    AIDB.save();

    debug('Created Invite DB for ' + guild.id);
  }

  if (AIDB.usersExcluded.includes(member.user.id) ||
  AIDB.rolesExcluded.includes(member.roles.first().id) ||
  AIDB.channelsExcluded.includes(channel.id)) return false;

  const content = message.content;
  // eslint-disable-next-line max-len
  const inviteREGEX = /(discord(app)?\.com\/invite\/[a-zA-Z0-9-_]{5,})|(discord(app)?\.gg\/[a-zA-Z0-9-_]{5,})|(discord\.me\/[a-zA-Z0-9-_]{5,})|(discord\.me\/invite\/[a-zA-Z0-9-_]{5,})|(discord\.gg\/[a-zA-Z0-9-_]{5,})|(discord\.gg\/invite\/[a-zA-Z0-9-_]{5,})|(discord\.com\/invite\/[a-zA-Z0-9-_]{5,})|(discord\.com\/[a-zA-Z0-9-_]{5,})|(discordapp\.com\/invite\/[a-zA-Z0-9-_]{5,})|(discordapp\.com\/[a-zA-Z0-9-_]{5,})/g;
  const invite = content.match(inviteREGEX);
  const inviteLink = invite ? invite[0] : null;

  if (!inviteLink || AIDB.invitesExcluded.includes(inviteLink)) return false;

  const fetched = await aruna.fetchInvite(inviteLink);

  if (AIDB.ignoreLocal && fetched.guild.id === guild.id) return false;

  const embed = new Discord.RichEmbed()
    .setAuthor(lang.antiInvite.embed.title.replace('%s', message.member.displayName), message.author.avatarURL)
    .setDescription(lang.antiInvite.embed.description)
    .setFooter(lang.antiInvite.embed.footer.replace('%s', message.member.displayName))
    .setColor('#ff0000')
    .setTimestamp();

  await message.delete().catch(() => {});

  message.reply(embed);
  return true;
}

exports.check = check;
