const Discord = require("discord.js");
const config = require("../configs/cf.js");
const database = require("../configs/mongoose.js");
const emoji = require("../utils/emojis.js");

exports.run = (aruna, message, args) => {
  
  const mentionedUser = message.guild.member(
    message.mentions.users.first() ||
      aruna.users.get(args[0]) ||
      message.author
  );

  let userNickName =
    mentionedUser.nickname !== null
      ? `${mentionedUser.nickname}`
      : "Sem apelido";
  let userDaysDiscord = Math.round(
    Math.abs(
      (mentionedUser.user.createdAt.getTime() - new Date().getTime()) /
        (24 * 60 * 60 * 1000)
    )
  );
  let userStatus;
  if (mentionedUser.presence.status === "dnd") userStatus = `Não pertubar`;
  if (mentionedUser.presence.status === "idle") userStatus = `Ausente`;
  if (mentionedUser.presence.status === "stream") userStatus = `Transmitindo`;
  if (mentionedUser.presence.status === "offline") userStatus = `Offline`;
  if (mentionedUser.presence.status === "online") userStatus = `Disponível`;

  let userStatusEmoji;
  if (mentionedUser.presence.status === "dnd") userStatusEmoji = emoji.dnd;
  if (mentionedUser.presence.status === "idle") userStatusEmoji = emoji.idle;
  if (mentionedUser.presence.status === "stream")
    userStatusEmoji = emoji.stream;
  if (mentionedUser.presence.status === "offline")
    userStatusEmoji = emoji.offline;
  if (mentionedUser.presence.status === "online")
    userStatusEmoji = emoji.online;

  let userAdminServer;
  if (mentionedUser.hasPermission("ADMINISTRATOR") === true)
    userAdminServer = "Sim";
  if (mentionedUser.hasPermission("ADMINISTRATOR") === false)
    userAdminServer = "Não";

  let userAvatar = mentionedUser.user.displayAvatarURL;
  if (userAvatar.endsWith(".gif")) {
    userAvatar = `${mentionedUser.user.displayAvatarURL}?size=2048`;
  }
  let userRoles = `${mentionedUser.roles.map(roles => roles).join(" | ") ||
    `${emoji.error} Sem Cargo`}`;
  /*let trad = {
    CREATE_INSTANT_INVITE: "`Criar convite instantâneo`",
    KICK_MEMBERS: "`Expulsar usuários`",
    BAN_MEMBERS: "`Banir usuários`",
    ADMINISTRATOR: "`Administrador`",
    MANAGE_CHANNELS: "`Gerenciar canais`",
    MANAGE_GUILD: "`Gerenciar servidor`",
    ADD_REACTIONS: "`Adicionar reação`",
    VIEW_AUDIT_LOG: "`Ver registro de auditoria`",
    VIEW_CHANNEL: "`Ver canais`",
    READ_MESSAGES: "`Ver mensagens`",
    SEND_MESSAGES: "`Enviar mensagens`",
    SEND_TTS_MESSAGES: "`Enviar mensagens com aúdio`",
    MANAGE_MESSAGES: "`Gerenciar mensagens`",
    EMBED_LINKS: "`Links em embed`",
    ATTACH_FILES: "`Arquivos arquivados`",
    READ_MESSAGE_HISTORY: "`Ver histórico de mensagens`",
    MENTION_EVERYONE: "`Mencionar todos`",
    EXTERNAL_EMOJIS: "`Emojis externos`",
    USE_EXTERNAL_EMOJIS: "`Usar emojis externos`",
    CONNECT: "`Conectar`",
    SPEAK: "`Falar`",
    MUTE_MEMBERS: "`Silenciar usuários`",
    DEAFEN_MEMBERS: "`Perdoar usuários`",
    MOVE_MEMBERS: "`Mover usuários`",
    USE_VAD: "`Usar detecção de voz`",
    PRIORITY_SPEAKER: "`Prioridade para falar`",
    CHANGE_NICKNAME: "`Trocar apelido`",
    MANAGE_NICKNAMES: "`Gerenciar apelidos`",
    MANAGE_ROLES: "`Gerenciar cargos`",
    MANAGE_ROLES_OR_PERMISSIONS: "`Gerenciar cargos e permissões`",
    MANAGE_WEBHOOKS: "`Gerenciar webhooks`",
    MANAGE_EMOJIS: "`Gerenciar emojis`"
  };
  let userPerms = mentionedUser.permissions
    .toArray()
    .map(perms => `${trad[perms]}`)
    .join(", ");
*/
  var stringtime = ""
  
  if(userDaysDiscord == 1) stringtime = "dia"
  else stringtime = "dias"
    
  let embed = new Discord.RichEmbed()
    .setAuthor(`${mentionedUser.user.username}`, `${userAvatar}`)
    .addField(
      `(${emoji.boss}) Nome`,
      `${mentionedUser.user.username}`,
      true
    )
    .addField(`(${userStatusEmoji}) Status`, `${userStatus}`, true)
    .addField(
      `(${emoji.customer}) Administrador`,
      `${userAdminServer}`,
      true
    )
    .addField(
      `(${emoji.menu}) Discord Tag`,
      `${mentionedUser.user.tag}`,
      true
    )
    .addField(`(${emoji.discord}) Apelido`, `${userNickName}`, true)
    .addField(
      `(${emoji.pass}) Dias no discord`,
      `${userDaysDiscord} ${stringtime}`,
      true
    )
    .addField(`(${emoji.picture}) Cargos`, `${userRoles}`, true)
    .setFooter("Criada pelo Lobo Metalurgico")
    .setThumbnail(userAvatar)
    .setColor("#56eaf5")
    .setTimestamp();

  /*let embed2 = new Discord.RichEmbed()
    .setAuthor(`${mentionedUser.user.username}`, `${userAvatar}`)
    .addField(`(${emoji.passport}) Permissões`, `${userPerms}`)
    .setFooter("Criada pelo Lobo Metalurgico")
    .setThumbnail(userAvatar)
    .setColor("#56eaf5")
    .setTimestamp();*/
  
  message.channel.send(embed)
    
    /*.then(msg => {
    msg.react("638067652337729597");
    const collector = msg.createReactionCollector(
      (r, u) =>
        r.emoji.name === "passport" &&
        (u.id !== aruna.user.id && u.id === message.author.id)
    );
    collector.on("collect", r => {
      switch (r.emoji.name) {
        case "passport":
          msg.edit(embed2).then(msg2 => {
            msg2.react("⬅");
            const collector2 = msg.createReactionCollector(
              (r, u) =>
                r.emoji.name === "⬅" &&
                (u.id !== aruna.user.id && u.id === message.author.id)
            );
            collector2.on("collect", r => {
              switch (r.emoji.name) {
                case "⬅":
                  msg.edit(embed);
              }
            });
          });
      }
    });
  });*/
};
exports.config = {
  name: "userinfo",
  aliases: ["ui"],
  category: `${emoji.robot} Utilidades`
};
