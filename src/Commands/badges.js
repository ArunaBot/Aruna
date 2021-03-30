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
const { database } = require('../../Configs');

exports.run = async (aruna, message, args) => {
  const guild = await database.Guilds.findOne({ _id: message.guild.id });

  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse servidor já é VIP!')
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse servidor já é um PARCEIRO!')
    .setTimestamp();
  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse servidor já é um PARCEIRO+')
    .setTimestamp();
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse servidor não é um PARCEIRO+')
    .setTimestamp();
  const error5 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse servidor não é um PARCEIRO')
    .setTimestamp();
  const error6 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse servidor não é VIP')
    .setTimestamp();
  const error8 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Erro Desconhecido!')
    .setTimestamp();
  const error9 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Opção Inválida! Use apenas `set` ou `remove` como argumento primário!')
    .setTimestamp();
  const error10 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Insira Algum Argumento!')
    .setTimestamp();
  const error11 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Opção Inválida! Use apenas `partner`, `vip` ou `partner+` como argumento secundário!')
    .setTimestamp();

  if (!args[0]) {
    return message.channel.send(error10);
  } else if (args[0].toLowerCase() !== 'set' && args[0].toLowerCase() !== 'remove') {
    return message.channel.send(error9);
  } else if (!args[1] || args[1] !== 'partner+' && args[1] !== 'partner' && args[1] !== 'vip') {
    return message.channel.send(error11);
  }

  const sucess = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter('Sucesso!')
    .setDescription(`The Badge \`${args[1]}\` has been \`${args[0]}ed\` with sucess!`)
    .setTimestamp();

  var vip = guild.isPremium;
  var partner = guild.isPartner;
  var partnerPlus = '';

  if (vip == true && partner == true) {
    partnerPlus = true;
  }

  if (args[0] == 'set') {
    if (args[1] == 'partner+') {
      if (partnerPlus == true) {
        return message.channel.send(error3);
      } else if (vip == true) {
        guild.isPartner = true;
        await guild.save();
        return message.channel.send(sucess);
      } else if (partner == true) {
        guild.isPremium = true;
        await guild.save();
        return message.channel.send(sucess);
      } else {
        guild.isPartner = true;
        guild.isPremium = true;
        await guild.save();
        return message.channel.send(sucess);
      }
    } else if (args[1] == 'partner') {
      if (partner == true) {
        return message.channel.send(error2);
      } else {
        guild.isPartner = true;
        await guild.save();
        return message.channel.send(sucess);
      }
    } else if (args[1] == 'vip') {
      if (vip == true) {
        return message.channel.send(error1);
      } else {
        guild.isPremium = true;
        await guild.save();
        return message.channel.send(sucess);
      }
    } else return message.channel.send(error8);
  } else if (args[0] == 'remove') {
    if (args[1] == 'partner+') {
      if (partnerPlus == false) {
        return message.channel.send(error4);
      } else {
        guild.isPartner = false;
        guild.isPremium = false;
        await guild.save();
        return message.channel.send(sucess);
      }
    } else if (args[1] == 'partner') {
      if (partner == false) {
        return message.channel.send(error5);
      } else {
        guild.isPartner = false;
        await guild.save();
        return message.channel.send(sucess);
      }
    } else if (args[1] == 'vip') {
      if (vip == false) {
        return message.channel.send(error6);
      } else {
        guild.isPremium = false;
        await guild.save();
        return message.channel.send(sucess);
      }
    } else return message.channel.send(error8);
  } else return message.channel.send(error8);
};

exports.config = {
  name: 'badge',
  aliases: ['badges'],
  category: '🧰 Administração',
  public: false
};