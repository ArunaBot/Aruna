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
var { config, database } = require('../../Configs');
const { links } = require('../../Configs');

const lang = require(`../../languages/bot/${config.language}/events.json`);

const serverStatsPrincipal = {
  guildID: '660610178009530380',
  oldGuildID: '610206821763776522'
};


var noFakeId = config.noFakeId;

exports.run = async (aruna, member) => {
  const user = database.Users.findOne({ _id: member.user.id });
  const guild = database.Guilds.findOne({ _id: member.guild.id });

  const langD = require(`../../languages/bot/${guild.language || config.defaultLanguage}/events.json`);

  if (guild.antiFakeEnable) {
    const kickFakeEmbed = new Discord.RichEmbed()
      .setAuthor(langD.memberAdd.antifake.embed.fakemember.title.replace('[username]', member.user.username), member.user.avatarURL)
      .setFooter(langD.memberAdd.antifake.embed.fakemember.footer.replace('[username]', member.user.username))
      .setDescription(langD.memberAdd.antifake.embed.fakemember.description)
      .setTimestamp();

    noFakeId.forEach(async id => {
      if (member.guild.member(id)) {
        const userNew = member.user.username.toLocaleLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const noFakeUser = await aruna.fetchUser(id);
        const noFakeUsername = noFakeUser.username.toLocaleLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (userNew == noFakeUsername && !noFakeId.includes(member.user.id)) {
          if (member.guild.members.get(aruna.user.id).hasPermission('KICK_MEMBERS')) {
            member.kick(langD.memberAdd.antifake.kickMessage);
            member.send(kickFakeEmbed);
          } else {
            const guildOwner = member.guild.owner;
            const fakeUser = member.user;
            const adminFakeWarn = new Discord.RichEmbed()
              .setAuthor(langD.memberAdd.antifake.embed.adminwarn.title.replace('[username]', guildOwner.user.username), guildOwner.user.avatarURL)
              .setFooter(langD.memberAdd.antifake.embed.adminwarn.footer)
              .setDescription(`${langD.memberAdd.antifake.embed.adminwarn.description.line1.replace('[fakeTag]', fakeUser.tag).replace('[fakeId]', fakeUser.id)}\n
            ${langD.memberAdd.antifake.embed.adminwarn.description.line2.replace('[prefix]', guild.prefix)}`)
              .setTimestamp();
            guildOwner.send(adminFakeWarn);
          }
        }
      }
    });
  }
  
  if (!user) {
    var saveU = new database.Users({ _id: member.user.id });
    await saveU.save();
    console.log(lang.memberAdd.db);
  }

  /* AUTOROLE MAIN GUILD*/
  
  if (member.guild.id == serverStatsPrincipal.guildID) {
    member.addRole('660612149009448988', 'AutoRole');
    const isOld = aruna.guilds
      .get('610206821763776522')
      .members.get(member.user.id);
    if (isOld) {
      isOld.kick('Entrou no novo Servidor');
    }
  } else if (member.guild.id == serverStatsPrincipal.oldGuildID) {
    const changingMessage = new Discord.RichEmbed()
      .setAuthor(langD.memberAdd.change.embed.title.replace('[username]', member.user.username), member.user.avatarURL)
      .setFooter(langD.memberAdd.change.embed.footer.replace('[username]', member.user.username))
      .setDescription(langD.memberAdd.change.embed.description.replace('[link]', links.supportServers[0]))
      .setTimestamp();
    member.send(changingMessage);
  }

  /* AUTOROLE FOR USERS */


};