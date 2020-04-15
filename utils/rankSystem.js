/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico 2019-2020

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

exports.run = async (aruna, message, db, cooldown, utils, Discord) => {
  let user = message.author;

  const rank = await db.Rank.findOne({
    user: user.id,
    guild: message.guild.id
  });

  let xp = rank.xp;
  if (xp === null) xp = 0;
  let level = rank.level;
  if (level === null) level = 0;

  if (!cooldown.is(user.id)) {
    cooldown.add(user.id);
    var add = Math.floor(Math.random() * 15) + 5;

    add = parseInt(add) + parseInt(rank.xp);
    rank.xp = add;
    rank.save();
    setTimeout(() => {
      cooldown.remove(user.id);
    }, 60 * 1000);
  }

  const rank2 = await db.Rank.findOne({
    user: user.id,
    guild: message.guild.id
  });

  while (xp >= utils.need(level)) {
    if (xp >= utils.need(level)) {
      const minus = parseInt(rank.xp) - parseInt(utils.need(level));
      rank2.xp = minus;
      const uplevel = parseInt(rank.level) + parseInt(1);
      rank2.level = uplevel;
      rank2.save();

      xp = rank2.xp;

      level = rank2.level;
      
      let embed = new Discord.RichEmbed()
        .setAuthor("Novo Nível!")
        .setDescription(
          `Parabéns <@${message.author.id}>` +
            ", agora você está no **Nível " +
            rank2.level +
            "**!"
        )
        .setColor([15, 15, 250])
        .setTimestamp();
      message.channel.send(embed);
      const args = "";
      let exiberank = require(`../cmds/rank.js`);
      exiberank.run(aruna, message, args);
    }
  }
};
