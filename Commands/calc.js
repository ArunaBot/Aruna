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

const emoji = require("../utils/emojis.js");
const Discord = require("discord.js");
const math = require("mathjs");

exports.run = (aruna, message, args) => {
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir o cálculo a ser feito.`)
    .setTimestamp();
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(
      `Desculpe, mas não consegui efetuar o cálculo. Tente inserir outra conta.`
    )
    .setTimestamp();

  if (!args[0]) return message.channel.send(error1);

  var response;

  try {
    response = math.eval(args.join(" "));
  } catch (e) {
    return message.channel.send(error2);
  }
  
  let embed = new Discord.RichEmbed()
      .setAuthor("Calculadora V2")
      .addField(
        `(${emoji.upload}) Entrada`,
        `\`\`\`js\n${args.join(' ')}\`\`\``
      )
      .addField(
        `(${emoji.dev}) Saida`,
        `\`\`\`js\n${response}\`\`\``
      )
      .setColor([54, 57, 63]);
    message.channel.send(embed);
};

exports.config = {
  name: "calc",
  aliases: ["calculadora", "math", "matematica", "calcular", "calculator"],
  category: `${emoji.robot} Utilidades`
};
