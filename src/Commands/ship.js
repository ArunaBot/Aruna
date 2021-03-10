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

const { config } = require('../../Configs');
var language = require(`../../languages/bot/${config.defaultLanguage}/commands.json`);

exports.run = async (client, message, args, langc) => {
  if (langc) {
    language = langc;
  }

  const error1 = new Discord.MessageEmbed()
    .setAuthor(language.generic.embed.error.title.replace('[username]', message.member.displayName), message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setFooter(language.generic.embed.error.footer.replace('[username]', message.member.displayName))
    .setDescription(language.ship.embed.error.description)
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
  } else if (message.guild.members.cache.get(args[0])) {
    user1 = message.guild.members.cache.get(args[0]).user;
  } else user1 = null;

  var user2;

  if (message.mentions.users.array()[1]) {
    user2 = message.mentions.users.array()[1];
  } else if (message.guild.members.cache.get(args[1])) {
    user2 = message.guild.members.cache.get(args[1]).user;
  } else user2 = message.author;

  if (!user1 || user1 === user2) return message.channel.send(error1);

  const avatar1 = await Jimp.read(user1.avatarURL({ format: 'png', dynamic: true, size: 1024 }));
  const avatar2 = await Jimp.read(user2.avatarURL({ format: 'png', dynamic: true, size: 1024 }));

  avatar1.resize(115, 115);
  avatar2.resize(115, 115);

  const baseImage = await Jimp.read(
    'https://cdn.discordapp.com/attachments/486016051851689994/509883077707694100/ships.png'
  );

  baseImage.composite(avatar1, 1, 1);
  baseImage.composite(avatar2, 229, 1);
  baseImage.write(`./tmp/img/${user1.id}-${user2.id}.png`);

  var mensagem =
    porcentagem <= 10
      ? language.ship.shipStatus[0].replace('%s', porcentagem).replace('%s', porcentagem)
      : porcentagem <= 20
        ? language.ship.shipStatus[1].replace('%s', porcentagem)
        : porcentagem <= 30
          ? language.ship.shipStatus[2].replace('%s', porcentagem)
          : porcentagem <= 40
            ? language.ship.shipStatus[3].replace('%s', porcentagem)
            : porcentagem <= 50
              ? language.ship.shipStatus[4].replace('%s', porcentagem)
              : porcentagem <= 60
                ? language.ship.shipStatus[5].replace('%s', porcentagem)
                : porcentagem <= 70
                  ? language.ship.shipStatus[6].replace('%s', porcentagem)
                  : porcentagem <= 80
                    ? language.ship.shipStatus[7].replace('%s', porcentagem)
                    : porcentagem <= 90
                      ? language.ship.shipStatus[8].replace('%s', porcentagem)
                      : porcentagem <= 100
                        ? language.ship.shipStatus[9].replace('%s', porcentagem)
                        : language.ship.shipStatus[10].replace('%s', porcentagem);
  
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
