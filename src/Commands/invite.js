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

const { emoji } = require("../Utils");
const Discord = require("discord.js");

exports.run = async (aruna, message) => {
  const embed = new Discord.RichEmbed().setAuthor(
    `Olá, ${message.author.username}`
  )
    .setDescription(`Fico feliz que tenha gostado de mim e queira me adicionar :) 
\nPara isso, basta clicar [aqui](
https://discordapp.com/oauth2/authorize?client_id=593303574725787657&scope=bot&permissions=2146954751), selecionar o servidor na lista, confirmar o reCaptcha e pronto, eu estarei em seu servidor! 
\nNovamente, obrigado pelo interesse e nos vemos em seu servidor!`);
  message.channel.send(embed);
};

exports.config = {
  name: "invite",
  aliases: ["convidar", "convite"],
  category: `${emoji.robot} Utilidades`
};
