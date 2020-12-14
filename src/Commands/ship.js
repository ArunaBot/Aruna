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
const Jimp = require('jimp');

exports.run = async (client, message, args) => {
  const error1 = new Discord.RichEmbed()
    .setAuthor('Oops!', message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription('Você deve mencionar no mínimo 1 usuário!')
    .setTimestamp();

  var porcentagem = 0;
  var aleatorio = Math.round(Math.random() * 100);

  porcentagem = aleatorio;

  if (!message.mentions.users.first() && isNaN(args[0])) {
    return message.channel.send(error1);
  } else if (!message.mentions.users.array()[1] && !!args[1] && isNaN(args[1])) {
    return message.channel.send(error1);
  }

  var user1;

  if (message.mentions.users.first()) {
    user1 = message.mentions.users.first();
  } else if (message.guild.members.get(args[0])) {
    user1 = message.guild.members.get(args[0]).user;
  } else user1 = null;

  var user2;

  if (message.mentions.users.array()[1]) {
    user2 = message.mentions.users.array()[1];
  } else if (message.guild.members.get(args[1])) {
    user2 = message.guild.members.get(args[1]).user;
  } else user2 = message.author;

  if (!user1 && user1 === user2) return message.channel.send(error1);

  const richard_lindu = await Jimp.read(user1.avatarURL);
  const richard_dmais = await Jimp.read(user2.avatarURL);

  richard_lindu.resize(115, 115);
  richard_dmais.resize(115, 115);

  const eu_amo_o_richard = await Jimp.read(
    'https://cdn.discordapp.com/attachments/486016051851689994/509883077707694100/ships.png'
  );

  eu_amo_o_richard.composite(richard_lindu, 1, 1);
  eu_amo_o_richard.composite(richard_dmais, 229, 1);
  eu_amo_o_richard.write(`./tmp/img/${user1.id}-${user2.id}.png`);

  const aido = new Array();
  aido[1] = 'Msg 1';
  aido[2] = 'Msg 2';

  var mensagem =
    porcentagem <= 10
      ? `${porcentagem}% [----------] Nada é impossível, apenas improvável.`
      : porcentagem <= 20
        ? `${porcentagem}% [█---------] Um dia talvez. `
        : porcentagem <= 30
          ? `${porcentagem}% [██--------] Bem, olhando por esse ângulo... `
          : porcentagem <= 40
            ? `${porcentagem}% [███-------] Possível, é. Díficil? De fato.`
            : porcentagem <= 50
              ? `${porcentagem}% [████------] Numa galáxia não tão distante...`
              : porcentagem <= 60
                ? `${porcentagem}% [█████-----] Até que formariam um belo casal. `
                : porcentagem <= 70
                  ? `${porcentagem}% [██████----] Esse casal está perto de ser muito bom! `
                  : porcentagem <= 80
                    ? `${porcentagem}% [███████---] Casal de primeira! `
                    : porcentagem <= 90
                      ? `${porcentagem}% [████████--] Já poderiam estar casados! 💍 `
                      : porcentagem <= 100
                        ? `${porcentagem}% [█████████-] Casal perfeito, só um terremoto os separa! 💍`
                        : `${porcentagem}% [██████████] Casal perfeito, ninguém os separa! 💍`;
  
  console.log(porcentagem);
  console.log(mensagem);
  message.channel.send({
    embed: {
      description: `${user1} + ${user2}\n\n**${mensagem}**`,
      color: 111119,
      image: {
        url: 'attachment://file.jpg'
      }
    },
    files: [
      {
        attachment: `./tmp/img/${user1.id}-${user2.id}.png`,
        name: 'file.jpg'
      }
    ]
  });
};

exports.config = {
  name: 'ship',
  aliases: ['shipar', 'shipp', 'casal'],
  category: '🎉 Entretenimento',
  public: true
};
