/* eslint-disable max-len */
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
var { database, config, links } = require('../../Configs');
const { utils, cooldown } = require('../Utils');

exports.run = async (aruna, message) => {
  if (message.author.bot) return;

  const emojiError = 'Para meu funcionamento, preciso da permissão de `Usar Emojis Externos`. Por favor, solicite para algum administrador que ative isso para que eu possa funcionar :)';
  const linkError = 'Para meu funcionamento, preciso da permissão de `Enviar Links`. Por favor, solicite para algum administrador que ative isso para que eu possa funcionar :)';
  const dmError = 'Desculpe, mas ainda não funciono em mensagens diretas :(';

  if (message.channel.type == 'dm') {
    return message.reply(dmError);
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
        console.log('No Server!');
        var saveG = await new database.Guilds({
          _id: message.guild.id
        });
        await saveG.save();
        servidor = await database.Guilds.findOne({ _id: message.guild.id });
      }

      if (!usuario) {
        console.log('No User!');
        var saveU = await new database.Users({ _id: message.author.id });
        await saveU.save();
        usuario = await database.Users.findOne({ _id: message.author.id });
      }

      var prefix = servidor.prefix || config.prefix;

      const mention = [`<@${aruna.user.id}>`, `<@!${aruna.user.id}>`];

      mention.find(mention => {
        if (!message.guild.members.get(aruna.user.id).hasPermission('USE_EXTERNAL_EMOJIS')) {
          return message.reply(emojiError);
        } else if (!message.guild.members.get(aruna.user.id).hasPermission('EMBED_LINKS')) {
          return message.reply(linkError);
        } else if (message.content === mention) {
          const embed = new Discord.RichEmbed()
            .setAuthor('Quem me chama?')
            .setDescription(
              `Ah, olá ${message.author.username}, como está? Eu sou a ${aruna.user.username}.\n
              Bom, caso queira saber minha função, ela é ajudar seu servidor de várias formas criativas e diferentes!\n
              Talvez você não saiba meu prefixo neste servidor e por isso me chamou. Se essa for sua dúvida, ele é \`\`${prefix}\`\`.\n\n
              Se você tiver alguma sugestão ou tiver encontrado algum parafuso meu perdido por aí, entre no meu [servidor de suporte](${links.supportServers[0]}) para falar com meu criador.\n\n
              Se quiser me adicionar em seu servidor, basta clicar [aqui](${links.invites[0]})!\n\n
              E por fim, obrigada por me chamar. Foi ótimo te explicar quem sou <3`
            )
            .setColor('#8400ff')
            .setTimestamp();
          return message.channel.send(embed);
        }
      });

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

        const xpsystem = require('../utils/rankSystem.js');
        xpsystem.run(aruna, message, db, cooldown, utils, Discord);
      }

      if (message.content.startsWith(prefix)) {
        if (message.content === prefix) return;

        const args = message.content
          .slice(prefix.length)
          .trim()
          .split(/ +/g);
        const comando = args.shift().toLowerCase();
        const ma = message.content.split(' ');
        const cmd = ma[0];
        const commandFile =
          aruna.commands.get(cmd.slice(prefix.length)) ||
          aruna.commands.get(aruna.aliases.get(cmd.slice(prefix.length)));

        if (commandFile) {
          if (!message.guild.members.get(aruna.user.id).hasPermission('USE_EXTERNAL_EMOJIS')) {
            return message.reply(emojiError);
          } else if (!message.guild.members.get(aruna.user.id).hasPermission('EMBED_LINKS')) {
            return message.reply(linkError);
          }
          commandFile.run(aruna, message, args, prefix, comando);
        } else if (!commandFile) {
          const alts =
            aruna.commands
              .filter(c =>
                c.config.name.startsWith(cmd.slice(prefix.length).toLowerCase())
              )
              .map(a => '`' + a.config.name + '`')
              .join(', ') || undefined;

          if (alts !== undefined) {
            message.reply(
              'Oops, não encontrei o comando ' +
                '`' +
                comando +
                '`' +
                '. Você quis dizer algo como ' +
                alts +
                '?'
            );
          }
        }
      }
    }).catch(e => {
      console.log(e);
    });
  }).catch(e => {
    console.log(e);
  });
};
