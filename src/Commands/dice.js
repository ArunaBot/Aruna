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

exports.run = async (aruna, message, args) => {
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você deve inserir o tipo do dado que devo girar!')
    .setTimestamp();

  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Só aceito até d100.')
    .setTimestamp();

  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Essa quantidade de dados é absurda!')
    .setTimestamp();

  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Acho que esse número nem existe!')
    .setTimestamp();

  const error5 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Insira algo como 1d6 por favor')
    .setTimestamp();
  
  const error6 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Todos sabemos que o resultado do d0 é 0!')
    .setTimestamp();
  
  const error7 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('0 não é uma quantidade de dados que se possa girar!')
    .setTimestamp();

  if (!args[0]) return message.channel.send(error5);

  const split = message.content
    .slice(5)
    .trim()
    .split('d' || 'D');

  if (!split) return message.channel.send(error5);

  var number = split[0];

  if (!number) return message.channel.send(error5);

  const dice = split[1];

  if (!dice) return message.channel.send(error1);

  if (dice > 200) return message.channel.send(error2);

  if (number > 50) return message.channel.send(error3);
  
  if (dice == 0) return message.channel.send(error6);
  
  if (number == 0) return message.channel.send(error7);
  
  var diceStr = '';
  
  if (number == 1) diceStr = 'dado';
  else diceStr = 'dados';
  
  const error8 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Todos sabemos que o resultado de ${number} ${diceStr} de 1 lado é ${number}!`)
    .setTimestamp();
  
  if (dice == 1) return message.channel.send(error8);

  var result = [];

  var loop = number;
  var embed = '';

  var idVar = setInterval(() => {
    if (loop <= 0) {
      
      if (number > 1) {

        embed = new Discord.RichEmbed()
          .setAuthor(
            `Resultado dos ${number} dados de ${dice} lados girados por ${message.author.username}`,
            message.author.avatarURL
          )
          .setDescription(`\`${result}\``)
          .setFooter(`Dados de ${message.author.username}`)
          .setTimestamp();
      } else {
        embed = new Discord.RichEmbed()
          .setAuthor(
            `Resultado do dado de ${dice} lados girado por ${message.author.username}`,
            message.author.avatarURL
          )
          .setDescription(`\`${result[0]}\``)
          .setFooter(`Dados de ${message.author.username}`)
          .setTimestamp();
      }
      clearInterval(idVar);
      return message.channel.send(embed);
    }

    loop = loop - 1;

    var math = Math.floor(Math.random() * dice) + 1;

    if (math >= 500) {
      clearInterval(idVar);
      return message.channel.send(error4);
    }

    result.push(math);
  }, 0,1);
};
exports.config = {
  name: 'dice',
  aliases: ['dado'],
  category: '🎉 Entretenimento'
};
