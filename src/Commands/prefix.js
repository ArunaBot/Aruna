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
const { database, config } = require('../../Configs');

/** @deprecated This Will Be Removed In A future Version */
exports.run = async (aruna, message, args) => {
  const guild = await database.Guilds.findOne({ _id: message.guild.id });

  const nopermission = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você não possui a permissão de `Gerenciar Servidor`')
    .setTimestamp();
  const prefixError = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription(
      'Insira se você deseja definir um prefixo (set) ou se deseja voltar ao padrão (remove).'
    )
    .setTimestamp();
  const prefixError2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você deve inserir o prefixo desejado!')
    .setTimestamp();
  const prefixError3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('O prefixo atual já é o prefixo padrão!')
    .setTimestamp();
  const prefixRemove = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter('Sucesso!')
    .setDescription(
      `Prefixo redefinido para \`${config.prefix}\` com sucesso!`
    )
    .setTimestamp();
  const prefixDefinido = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter('Sucesso!')
    .setDescription(`Prefixo definido para \`${args[1]}\` com sucesso!`)
    .setTimestamp();
  const deprecatedWarn = new Discord.RichEmbed()
    .setTitle('🚫FUNÇÃO OBSOLETA🚫')
    .setDescription(`**AVISO: ESSA É UMA FUNÇÃO ANTIGA E SERÁ REMOVIDA EM BREVE.**\n
    Para evitar transtornos, é recomendado usar \`${guild.prefix}config prefix <set/remove> <prefixoDesejado>\`.`)
    .setColor('#fcec03')
    .setFooter('Deprecated Command Warn')
    .setTimestamp();

  message.channel.send(deprecatedWarn).then(msg => msg.delete(60000));
  if (!message.member.hasPermission('MANAGE_GUILD'))
    return message.channel.send(nopermission);

  if (!args[0]) return message.channel.send(prefixError);

  if (args[0] !== 'set' && args[0] !== 'remove')
    return message.channel.send(prefixError);

  if (args[0] === 'remove') {
    if (guild.prefix === config.prefix)
      return message.channel.send(prefixError3);

    guild.prefix = config.prefix;
    guild.save();
    message.channel.send(prefixRemove);
  }

  if (args[0] === 'set') {
    if (!args[1]) return message.channel.send(prefixError2);

    guild.prefix = args[1];
    guild.save();
    message.channel.send(prefixDefinido);
  }
};

exports.config = {
  name: 'prefix',
  aliases: ['prefixo', 'pref'],
  category: '⚙️ Configurações'
};
