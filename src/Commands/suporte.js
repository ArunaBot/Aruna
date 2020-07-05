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

exports.run = async (aruna, message) => {
  const embed = new Discord.RichEmbed().setAuthor(
    `Olá, ${message.author.username}`
  )
    .setDescription(`Encontrou algum erro esquisito, tem alguma reclamação ou sugestões para mim?
\nPara isso, basta clicar [aqui](
https://discord.gg/NqbBgEf) e venha conversar com meus desenvolvedores!`);
  message.channel.send(embed);
};

exports.config = {
  name: 'suporte',
  aliases: ['support'],
  category: `${emoji.robot} Utilidades`
};
