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
var database = require("../configs/mongoose.js");
const cf = require("../configs/cf.js");
const cooldown = require("../utils/cooldown.js");
const utils = require("../utils/utils.js");

exports.run = async (aruna, message, args) => {
  if (message.author.bot) return;

  if (message.channel.type == "dm") {
    return message.reply(
      "Desculpe, mas ainda não funciono em mensagens diretas :("
    );
  }

  database.Guilds.findOne({ _id: message.guild.id }, function(
    servro,
    servidor
  ) {
    database.Users.findOne({ _id: message.author.id }, async function(
      erro,
      usuario
    ) {
      if (!servidor) {
        console.log("No Server!");
        var saveG = await new database.Guilds({
          _id: message.guild.id
        });
        await saveG.save();
        servidor = await database.Guilds.findOne({ _id: message.guild.id });
      }

      if (!usuario) {
        console.log("No User!");
        var saveU = await new database.Users({ _id: message.author.id });
        await saveU.save();
        usuario = await database.Users.findOne({ _id: message.author.id });
      }

      let mention = [`<@${aruna.user.id}>`, `<@!${aruna.user.id}>`];

      mention.find(mention => {
        if (message.content === mention) {
          let embed = new Discord.RichEmbed()

            .setAuthor(
              `${aruna.user.username}`,
              `${aruna.user.displayAvatarURL}`
            )
            .setDescription(
              `Olá ${message.author.username}, como está? Você, deve estar se perguntando qual minha função.\nBom, minha função é ajudar seu servidor de várias formas mas principalmente na moderação e no entretenimento.\n\nSe você possuir uma sugestão ou tiver encontrado algum parafuso meu perdido por aí, entre em meu servidor de suporte para falar com meu criador.`
            )
            .addField(
              `⚒ Quais são meus comando?`,
              `Para saber meus comandos, basta usar **${servidor.prefix}help** e eu irei mandar meus comandos à você :)`
            )
            .addField(
              `👤 Qual meu servidor de suporte`,
              `Para entrar em meu servidor de suporte clique [aqui](https://discord.gg/8mtqyaA)!`
            )
            .setColor("#6e096a")
            .setTimestamp();

          message.channel.send(embed);
        }
      });

      var prefix = servidor.prefix;

      if (servidor.rankEnable === true) {
        const rank = await database.Rank.findOne({
          _id: `${message.author.id}-${message.guild.id}`
        });

        if (!rank) {
          var saveR = new database.Rank({
            _id: `${message.author.id}-${message.guild.id}`,
            user: message.author.id,
            xp: 0,
            level: 0,
            guild: message.guild.id
          });

          saveR.save();
        }
        const db = database;

        let xpsystem = require(`../utils/rankSystem.js`);
        xpsystem.run(aruna, message, db, cooldown, utils, Discord);
      }

      if (message.content.startsWith(prefix)) {
        if (message.content === prefix) return;

        let args = message.content
          .slice(prefix.length)
          .trim()
          .split(/ +/g);
        let comando = args.shift().toLowerCase();
        let ma = message.content.split(" ");
        let cmd = ma[0];
        let commandFile =
          aruna.commands.get(cmd.slice(prefix.length)) ||
          aruna.commands.get(aruna.aliases.get(cmd.slice(prefix.length)));

        if (commandFile) {
          if (
            !message.guild.members
              .get(aruna.user.id)
              .hasPermission("USE_EXTERNAL_EMOJIS")
          )
            return message.reply(
              "Para meu funcionamento, preciso da permissão de `Usar Emojis Externos`"
            );
          commandFile.run(aruna, message, args, prefix, comando);
        } else if (!commandFile) {
          let alts =
            aruna.commands
              .filter(c =>
                c.config.name.startsWith(cmd.slice(prefix.length).toLowerCase())
              )
              .map(a => "`" + a.config.name + "`")
              .join(", ") || undefined;

          if (alts !== undefined) {
            message.reply(
              "Oops, não encontrei o comando " +
                "`" +
                comando +
                "`" +
                ". Você quis dizer algo como " +
                alts +
                "?"
            );
          } else {
            message.reply(
              "Oops, não encontrei o comando " + "`" + comando + "` :("
            );
          }
        }
      }
    }).catch(e => {});
  }).catch(e => {});
};
