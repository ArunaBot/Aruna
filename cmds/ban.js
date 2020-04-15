const Discord = require("discord.js");

exports.run = async (aruna, message, args) => {
  
  let buser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  
  const error1 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não possui a permissão de \`Banir Membros\`!`)
    .setTimestamp();
  
  const error2 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não possuo a permissão de \`Banir Membros\`!`)
    .setTimestamp();
  
  const error3 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você deve inserir um usuário para ser punido!`)
    .setTimestamp();
  const error4 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não pode banir ${buser.user.username} pois este é o(a) dono(a) do servidor!`)
    .setTimestamp();
  const error5 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Você não pode banir este usuário pois seu cargo é igual ou inferior ao de ${buser.user.username}.`)
    .setTimestamp();
  const error6 = new Discord.RichEmbed()
    .setAuthor(`Oops, ${message.author.username}`, message.author.avatarURL)
    .setFooter(`Algo deu errado, ${message.author.username}`)
    .setDescription(`Eu não posso banir este usuário pois meu cargo é igual ou inferior ao de ${buser.user.username}`)
    .setTimestamp();
  
  if (!message.member.hasPermission("BAN_MEMBERS"))
    return message.channel.send(error1)
  if (!message.guild.members.get(aruna.user.id).hasPermission("BAN_MEMBERS"))
    return message.channel.send(error2)
  
  if (!buser) return message.channel.send(error3);
  
  if(message.guild.owner.id == buser.user.id)
    return message.channel.send(error4)
  if(buser.highestRole.position >= message.guild.members.get(message.author.id).highestRole.position && message.guild.owner.id !== message.author.id)
    return message.channel.send(error5);
  if(buser.highestRole.position >= message.guild.members.get(aruna.user.id).highestRole.position)
    return message.channel.send(error6);
  
  if (args.join(" ").slice(22)) {
    var breason = `Punido por: ${message.author.username}`;
  } else {
    var breason =
      `Punido por: ${message.author.username} Com o Motivo: ` +
      args.join(" ").slice(22);
  }

  let embed = new Discord.RichEmbed()
    .setAuthor("Banimento Efetuado!")
    .setDescription(`Kick efetuado por ${message.author.username}`)
    .addField("Usuário Banido: ", `${buser} id ${buser.id}`, false)
    .addField("Banido por: ", `<@${message.author.id}>`, false)
    .addField("Data do Banimento: ", message.createdAt, false)
    .addField("Motivo: ", `${breason}`, false)
    .setTimestamp();

  message.channel.send(embed);
  message.guild.member(buser).ban(breason);
};

exports.config = {
  name: "ban",
  aliases: ["banir"],
  category: `👮‍♂️ Moderação`
};