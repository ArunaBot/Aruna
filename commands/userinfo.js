const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let inline = true;
  let resence = true;
  const status = {
    online: "<:online:637026750408294460> Online",
    idle: "<:idle:637026749540204586> Ausente",
    dnd: "<:dnd:637026749401530369> Não Pertube",
    offline: "<:offline:637026750295048223> Offline"
  };

  const member =
    message.mentions.members.first() ||
    message.guild.members.get(args[0]) ||
    message.member;
  let target = message.mentions.users.first() || message.author;

  var time = Math.round(Math.abs((member.user.createdAt.getTime() - new Date().getTime())/(24*60*60*1000)))
  
  if(time === 1) {
    time = Math.round(Math.abs((member.user.createdAt.getTime() - new Date().getTime())/(24*60*60*1000))) + " Dia"
  } else if(time !== 1) {
    time = Math.round(Math.abs((member.user.createdAt.getTime() - new Date().getTime())/(24*60*60*1000))) + " Dias"
  } else time = "ERROR"
    
  if (member.user.bot === true) {
    bot = "<:robotpngrepocom:637026750336860173> Sim";
  } else {
    bot = "<:bosspngrepocom:637026749225631746> Não";
  }

  let embed = new Discord.RichEmbed()
    //.setAuthor(member.user.username)
    .setThumbnail(target.displayAvatarURL)
    .setColor("#00ff00")
    .addField("Nome de Usuário", `${member.user.tag}`, inline)
    .addField("ID", member.user.id, inline)
    .addField(
      "Apelido",
      `${
        member.nickname !== null
          ? `<:likesvgrepocom:637027334456606740> ${member.nickname}`
          : "<:errorsvgrepocom:637027333986975770> Nenhum Apelido"
      }`,
      true
    )
    .addField("Bot", `${bot}`, inline, true)
    .addField("Status", `${status[member.user.presence.status]}`, inline, true)
    .addField(
      "Jogando",
      `${
        member.user.presence.game
          ? `🎮 ${member.user.presence.game.name}`
          : "<:errorsvgrepocom:637027333986975770> Não está jogando"
      }`,
      inline,
      true
    )
    .addField(
      "Cargos",
      `${member.roles
        .filter(r => r.id !== message.guild.id)
        .map(roles => roles)
        .join(" **|** ") || "<:errorsvgrepocom:637027333986975770> Sem Cargo"}`,
      true
    )
    .addField("Entrou no discord a", time)
    .setFooter(`Informações sobre ${member.user.username}`)
    .setTimestamp();

  message.channel.send(embed);
};

module.exports.help = {
  name: "userinfo"
};
