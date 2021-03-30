/* eslint-disable no-unused-vars */
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
const { database, config } = require('../../Configs');

exports.run = async (aruna, message, args, langc, prefix, comando) => {
  const util = require('util');
  const code = args.join(' ');
  const embed = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription('Você precisa digitar um código!')
    .setFooter(`Algo deu errado, ${message.author.username}`);
  if (!code) return message.channel.send(embed);
  
  try {

    var str;
    // eslint-disable-next-line max-len
    if (code.includes(`${aruna.token}` || `${process.env.TOKEN}` || `${config.token}` || 'aruna.token' || 'process.env.token' || 'config.token')) {
      str = 'Erro! Você não pode exibir esta informação!';
    } else {
      const ev = await eval(code);
      str = util.inspect(ev, { depth: 1 });
      str = `${str.replace(
        new RegExp(`${aruna.token}|${process.env.TOKEN}|${config.token}`, 'g'),
        'Erro! Você não pode exibir esta informação!'
      )}`;
    }

    if (str.length > 1800) {
      str = str.substr(0, 1800);
      str = str + '...';
    }

    const embed = new Discord.RichEmbed()
      .setAuthor('Console')
      .addField(
        '(<:uploaduisvgrepocom:637027335173832727>) Entrada',
        `\`\`\`js\n${code}\`\`\``
      )
      .addField(
        '(<:developmentsvgrepocom:637027334553337896>) Saida',
        `\`\`\`js\n${str}\`\`\``
      )
      .setColor([54, 57, 63]);
    message.channel.send(embed);
  } catch (err) {
    message.channel.send(err.stack, { code: 'js' });
  }
};

exports.config = {
  name: 'eval',
  aliases: [],
  category: '🧰 Administração',
  public: false
};
