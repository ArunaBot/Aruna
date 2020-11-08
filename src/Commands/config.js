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

const { config, database } = require('../../Configs');
const Discord = require('discord.js');

var options = ['rank', 'autorole', 'prefix'];

exports.run = async (aruna, message, args) => {
  const noPermission = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você não possui a permissão de `Gerenciar Servidor`')
    .setTimestamp();
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Por Favor, utilize uma das seguintes opções junto ao comando: ${options}`)
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Esse comando não pode ser configurado no momento :(')
    .setTimestamp();

  const guild = await database.Guilds.findOne({ _id: message.guild.id });
  
  const user = await database.Users.findOne({ _id: message.author.id });

  if (!message.member.hasPermission('MANAGE_GUILD'))
    return message.channel.send(noPermission);

  if (!args || !args[0]) return message.channel.send(error1);

  if (!options.includes(args[0].toLowerCase())) {
    return message.channel.send(error1);
  }

  switch (args[0].toLowerCase()) {
    case 'prefix':
      prefixVar(args[1] || null);
      break;
    default:
      return message.channel.send(error1);
  }

  async function prefixVar(action) {
    const actionList = ['set', 'remove', 'definir', 'remover'];

    if (!action || !actionList.includes(action)) return invalidAction(actionList);

    const prefixError = new Discord.RichEmbed()
      .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
      .setFooter(`Algo deu errado, ${message.author.username}`)
      .setDescription('Você deve inserir o prefixo desejado!')
      .setTimestamp();
    const prefixError2 = new Discord.RichEmbed()
      .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
      .setFooter(`Algo deu errado, ${message.author.username}`)
      .setDescription('Esse já é o prefixo atual!')
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
      .setDescription(`Prefixo definido para \`${args[2] || undefined}\` com sucesso!`)
      .setTimestamp();

    switch (action) {
      case 'set':
      case 'definir':
        if (!args[2]) return message.channel.send(prefixError);

        if (args[2] === guild.prefix) return message.channel.send(prefixError2);

        guild.prefix = args[2];

        guild.save();
          
        message.channel.send(prefixDefinido);

        break;
      case 'remove':
      case 'remover':
        if (guild.prefix === config.general.prefix) return message.channel.send(prefixError3);

        guild.prefix = config.prefix;

        guild.save();

        message.channel.send(prefixRemove);

        break;
      default:
        return invalidAction(actionList);
    }
  }

  async function isEnabled (command) {
    const dbCommand = await database.Commands.findOne({ _id: `${command}` });

    if (!dbCommand || (!dbCommand.public && !user.SUPER)) {
      message.channel.send(error2);
      return false;
    }

    const no = new Discord.RichEmbed()
      .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
      .setFooter(`Algo deu errado, ${message.author.username}`)
      .setDescription(
        `Neste momento, o comando ${command} está desativado. Para ativar, use \`\`${guild.prefix}config ${command} ativar\`\`.`
      )
      .setTimestamp();
    const yes = new Discord.RichEmbed()
      .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
      .setFooter(`Algo deu errado, ${message.author.username}`)
      .setDescription(
        `Neste momento, o comando ${command} está ativado. Para desativar, use \`\`${guild.prefix}config ${command} desativar\`\`.`
      )
      .setTimestamp();

    if (guild[command + 'Enable']) {
      message.channel.send(yes);
      return true;
    } else if (!guild[command + 'Enable']) {
      message.channel.send(no);
      return false;
    }
    return undefined;
  }

  function invalidAction (option) {
    const optionError = new Discord.RichEmbed()
      .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
      .setFooter(`Algo deu errado, ${message.author.username}`)
      .setDescription(`Por Favor, utilize uma das seguintes ações após a seleção da opção: ${option}`)
      .setTimestamp();
    return message.channel.send(optionError);
  } 

  /* Below this line, old code */
  
  const toDo = args[1].toLowerCase();

  const ativo = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter('Sucesso!')
    .setDescription(`O comando \`${command}\` foi ativado com sucesso!`)
    .setTimestamp();

  const inativo = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter('Sucesso!')
    .setDescription(`O comando \`${command}\` foi desativado com sucesso!`)
    .setTimestamp();

  if (toDo == 'ativar' && guild.verify === false || toDo == 'enable' && guild.verify === true) {
    if (command === 'rank') {
      guild.rankEnable = true;
      guild.save();
    } else if (command === 'ticket') {
      const { activeticket } = require('../Utils');
      activeticket.run(aruna, message);
      guild.ticketEnable = true;
      guild.save();
    } else if (command === 'autocargo' || command === 'autorole') {
      guild.autoRole = true;
      guild.save();
    }
    return message.channel.send(ativo);
  } else if (guild.verify === false) return message.channel.send(yes);

  if (toDo == 'desativar' && guild.verify === true || toDo == 'disable' && guild.verify === true) {
    if (command === 'rank') {
      guild.rankEnable = false;
      guild.save();
    } else if (command === 'ticket') {
      guild.ticketEnable = false;
      guild.save();
    } else if (command === 'autocargo' || command === 'autorole') {
      guild.autoRole = false;
      guild.save();
    }
    return message.channel.send(inativo);
  } else if (guild.verify === true) return message.channel.send(no);
};

exports.config = {
  name: 'config',
  aliases: ['configurar', 'configurações'],
  category: '⚙️ Configurações',
  public: true
};
