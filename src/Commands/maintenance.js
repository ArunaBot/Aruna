/* eslint-disable no-unused-vars */
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

exports.run = (aruna, message, args) => {
  const user = database.Users.findOne({ _id: message.author.id });

  const errored = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setDescription('Você não tem permissão para executar esse comando!')
    .setFooter(`Algo deu errado, ${message.author.username}`);
    
  if (user.SUPER !== true) return message.channel.send(errored);
};

exports.config = {
  name: 'manutenção',
  aliases: [],
  category: '🧰 Administração',
  public: false
};