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

const Discord = require("discord.js");

exports.run = (aruna, message, args, prefix) => {
  const user1 = message.guild.member(
    message.mentions.users.first() || aruna.users.get(args[0]) || message.author
  );

  const user = user1.user;

  let embed = new Discord.RichEmbed()
    .setAuthor(`Avatar de ${user.username}`)
    .setDescription(`**Clique [aqui](${user.avatarURL}) para baixar a foto.**`)
    .setImage(user.avatarURL)
    .setTimestamp();
  message.channel.send(embed);
};
exports.config = {
  name: "avatar",
  aliases: [""],
  description: "Mostra o avatar próprio ou de um usuário",
  category: `🎉 Entretenimento`
};
