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
const { emoji } = require('../Utils');

exports.run = (aruna, message, args) => {
  var role = '';
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
  

  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você não possui a permissão de `Gerenciar Cargos`!')
    .setTimestamp();

  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Eu não possuo a permissão de `Gerenciar Cargos`!')
    .setTimestamp();
  
  if (!message.member.hasPermission('MANAGE_ROLES'))
    return message.channel.send(error1);
  if (!message.guild.members.get(aruna.user.id).hasPermission('MANAGE_ROLES'))
    return message.channel.send(error2);
  
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você deve inserir um rank para remover dos membros!')
    .setTimestamp();
  
  if (!role || role === undefined) return message.channel.send(error4);

  const error5 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Você não pode remover o cargo \`${role.name}\` pois meu cargo é esse ou inferior a ele.`
    )
    .setTimestamp();

  const error6 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Você não pode remover o cargo \`${role.name}\` pois seu cargo é esse ou inferior a ele.`
    )
    .setTimestamp();
  
  if (
    role.position >=
    message.guild.members.get(aruna.user.id).highestRole.position
  )
    return message.channel.send(error5);

  if (
    role.position >=
      message.guild.members.get(message.author.id).highestRole.position &&
    message.guild.owner.id !== message.author.id
  )
    return message.channel.send(error6);

  const executando = new Discord.RichEmbed()
    .setTitle(`${emoji.loading} Aguarde, ${message.author.username}`, message.author.avatarURL)
    .setColor('#f2ff00')
    .setFooter(`Operação em Execução, ${message.author.username}`)
    .setDescription(
      `O cargo \`${role.name}\` está sendo removido de todos os usuários do servidor. Por favor, aguarde um momento.`
    )
    .setTimestamp();

  const sucess = new Discord.RichEmbed()
    .setAuthor(`YAY, ${message.author.username}`, message.author.avatarURL)
    .setColor([0, 255, 0])
    .setFooter(`Operação efetuada com sucesso, ${message.author.username}`)
    .setDescription(
      `O cargo \`${role.name}\` foi removido de todos os usuários com sucesso!`
    )
    .setTimestamp();

  message.channel.send(executando).then(msg => {
    const roleGuild = message.guild;
    const memberArray = roleGuild.members.array();
    const memberCount = memberArray.length;
    for (var i = 0; i < memberCount; i++) {
      const member = memberArray[i];
      member.removeRole(role);
      if (memberCount - i <= 1){
        msg.edit(sucess);
      }
    }
  });
};

exports.config = {
  name: 'massremove',
  aliases: ['masscargoremove'],
  category: '👮‍♂️ Moderação'
};