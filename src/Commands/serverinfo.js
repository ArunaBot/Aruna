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

const Discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { emoji, date } = require('../Utils');
const { config, database } = require('../../Configs');
let language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);
const dateFormat = require('dateformat');


exports.run = async (aruna, message, args, langc) => {
  if (langc) {
    language = langc;
  }

  const guildDB = await database.Guilds.findOne({ _id: message.guild.id });

  let pType;
  
  if (guildDB.isPartner == true && guildDB.isPremium == true){
    pType = emoji.partnerPlus;
  } else if (guildDB.isPartner == true) {
    pType = emoji.partner;
  } else if (guildDB.isPremium == true){
    pType = emoji.premium;
  } else {
    pType = emoji.discord;
  }

  let guildIcon;

  if (message.guild.iconURL.includes('a_')) {
    guildIcon = message.guild.iconURL.slice(0, -3).trim() + 'gif';
  } else {
    guildIcon = message.guild.iconURL.replace('jpg', 'png');
  }
  
  const embed = new Discord.RichEmbed()
    .setColor([0, 23, 132])
    .setTitle(`${pType} ${message.guild.name}`)
    .setThumbnail(guildIcon)
    .addField(`:computer: ${language.serverinfo.embed.field1.title}`, message.guild.id, true)
    .addBlankField(true)
    .addField(`:crown: ${language.serverinfo.embed.field2.title}`, message.guild.owner, true)
    .addField(`:date: ${language.serverinfo.embed.field4.title}`, dateFormat(message.guild.createdTimestamp, language.generic.strings.date), true)
    .addField(`:desktop: ${language.serverinfo.embed.field5.title}`, aruna.shard.id, true)
    .addField(`:dizzy: ${language.serverinfo.embed.field6.title}`, dateFormat(message.guild.member(aruna.user).joinedTimestamp, language.generic.strings.date), true)
    .addField(
      language.serverinfo.embed.field7.title
        .replace('%1', ':speech_balloon:')
        .replace('%2',message.guild.channels.filter(
          chn => chn.type === 'text').size +
          message.guild.channels.filter(chn => chn.type === 'voice').size +
          message.guild.channels.filter(chn => chn.type === 'news').size +
          message.guild.channels.filter(chn => chn.type === 'store').size)
        .replace('%3', message.guild.channels.filter(chn => chn.type === 'category').size),
      language.serverinfo.embed.field7.content
        .replace('%1', ':pencil:')
        .replace('%2', message.guild.channels.filter(chn => chn.type === 'text').size)
        .replace('%3', ':speaking_head:')
        .replace('%4', message.guild.channels.filter(chn => chn.type === 'voice').size)
        .replace('%5', ':loudspeaker:')
        .replace('%6', message.guild.channels.filter(chn => chn.type === 'news').size),
      false
    )
    .setFooter(language.generic.embed.footer.replace('[usertag]', message.author.tag), message.author.avatarURL)
    .setTimestamp();

  if (message.guild.premiumSubscriptionCount >= 1 && message.guild.premiumTier >= 1) {
    embed.addField(`${emoji.nitro} ${language.serverinfo.embed.field9.title}`,
      language.serverinfo.embed.field9.content
        .replace('%1', emoji.nitro)
        .replace('%2', message.guild.premiumTier)
        .replace('%3', emoji.nitro)
        .replace('%4', message.guild.premiumSubscriptionCount),
      false
    );
  } else if (message.guild.premiumSubscriptionCount >= 1) {
    embed.addField(`${emoji.nitro} ${language.serverinfo.embed.field10.title}`,
      language.serverinfo.embed.field10.content
        .replace('%1', emoji.nitro)
        .replace('%2',message.guild.premiumSubscriptionCount),
      false
    );
  }

  message.channel.send(embed);
};

exports.config = {
  name: 'serverinfo',
  aliases: ['si', 'guildinfo', 'gi'],
  category: `${emoji.robot} Utilidades`,
  description: language.serverinfo.config.description,
  public: true
};
