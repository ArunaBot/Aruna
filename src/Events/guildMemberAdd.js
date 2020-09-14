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

const lang = require(`../languages/bot/${config.lang}/events.json`);
const langD = require(`../languages/bot/${config.defaultLanguage}/events.json`);

const serverStatsPrincipal = {
  guildID: '660610178009530380',
  oldGuildID: '610206821763776522'
};

exports.run = async (aruna, member) => {
  const user = database.Users.findOne({ _id: member.user.id });
  // eslint-disable-next-line no-unused-vars
  const guild = database.Guilds.findOne({ _id: member.guild.id });
  
  if (!user) {
    var saveU = await new database.Users({ _id: member.user.id });
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
      .setDescription(langD.memberAdd.change.embed.description.replace('[link]', 'https://discord.gg/NqbBgEf'))
      .setTimestamp();
    member.send(changingMessage);
  }

  /* AUTOROLE FOR USERS */


};
