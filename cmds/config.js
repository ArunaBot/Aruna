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

const database = require("../configs/mongoose.js");
const emoji = require("../utils/emojis.js");
const Discord = require("discord.js");

exports.run = async (aruna, message, args) => {
  var validOptions = ["rank", "ticket", "autorole"];

  const guild = await database.Guilds.findOne({ _id: message.guild.id });
  
  const user = await database.Users.findOne({ _id: message.author.id });

  const commandOff = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Este comando não está disponível no momento!`)
    .setTimestamp();
  const nopermission = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não possui a permissão de \`Gerenciar Servidor\``)
    .setTimestamp();
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Insira um dos seguintes comandos para que seja efetuado o gerenciamento: ` +
        "``" +
        validOptions +
        "``"
    )
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Este comando ainda não pode ser ativado. Desculpe pelo incoveniente.`
    )
    .setTimestamp();

  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.channel.send(nopermission);

  if (!args || !args[0]) return message.channel.send(error1);

  if (!validOptions.includes(args[0].toLowerCase())) return message.channel.send(error1);

  const command = args[0].toLowerCase();

  if (command === "rank") {
    guild.verify = guild.rankEnable;
  } else if (command === "ticket") {
    guild.verify = guild.ticketEnable;
  } else if (command === "autoRole" || command === "autorole") {
    guild.verify = guild.autoRole;
  }

  const no = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Neste momento, o comando ${command} não está ativado. Para ativar, use \`\`${guild.prefix}config ${command} ativar\`\`.`
    )
    .setTimestamp();
  const yes = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Neste momento, o comando ${command} está ativado. Para desativar, use \`\`${guild.prefix}config ${command} desativar\`\`.`
    )
    .setTimestamp();

  const dbcommand = await database.Commands.findOne({ name: `${command}` });

  if (!dbcommand || dbcommand.public !== true && user.SUPER !== true)
    return message.channel.send(error2);
  
  
  
  if (!args[1] || args[1] !== "ativar" && args[1] !== "desativar" && args[1] !== "enable" && args[1] !== "disable") {
    if (guild.verify === false) {
      return message.channel.send(no);
    } else {
      return message.channel.send(yes);
    }
  }
  
  const todo = args[1].toLowerCase()

  const ativo = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Sucesso!`)
    .setDescription(`O comando \`${command}\` foi ativado com sucesso!`)
    .setTimestamp();

  const inativo = new Discord.RichEmbed()
    .setColor([0, 255, 0])
    .setAuthor(`Yay, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Sucesso!`)
    .setDescription(`O comando \`${command}\` foi desativado com sucesso!`)
    .setTimestamp();

  if (todo == "ativar" && guild.verify === false || todo == "enable" && guild.verify === true) {
    if (command === "rank") {
      guild.rankEnable = true;
      guild.save();
    } else if (command === "ticket") {
      let enableTicket = require('../utils/activeTicket.js')
      enableTicket.run(aruna, message)
      guild.ticketEnable = true;
      guild.save();
    } else if (command === "autoRole" || command === "autorole") {
      guild.autoRole = true;
      guild.save();
    }
    return message.channel.send(ativo);
  } else if(guild.verify === false) return message.channel.send(yes);

  if (todo == "desativar" && guild.verify === true || todo == "disable" && guild.verify === true) {
    if (command === "rank") {
      guild.rankEnable = false;
      guild.save();
    } else if (command === "ticket") {
      guild.ticketEnable = false;
      guild.save();
    } else if (command === "autoRole" || command === "autorole") {
      guild.autoRole = false;
      guild.save();
    }
    return message.channel.send(inativo);
  } else if(guild.verify === true) return message.channel.send(no);
};

exports.config = {
  name: "config",
  aliases: ["configurar", "configurações"],
  category: `⚙️ Configurações`
};
