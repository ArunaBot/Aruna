const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Você precisa ter a permissão de `Banir Membros` para usar esta função.")
    if(!message.guild.members.get(client.user.id).hasPermission('BAN_MEMBERS')) return message.reply("Para esse comando eu preciso ter a permissão de `Banir Membros`.")
    let kuser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kuser) return message.channel.send("Usuário não encontrado!");
    if(kuser.hasPermission("BAN_MEMBERS")) return message.channel.send("Você não pode banir este usuário!")
    if(args.join(" ").slice(22) == undefined){
        var kreason = "Motivo não definido!"
    } else if(args.join(" ").slice(22) == false){
        var kreason = "Motivo não definido!"
    } else if(args.join(" ").slice(22) == null){
        var kreason = "Motivo não definido!"
    } else if(args.join(" ").slice(22) == ''){
        var kreason = "Motivo não definido!"
    } else{
        var kreason = args.join(" ").slice(22)
    }
    const kickChannel = message.channel
    

    let embed = new Discord.RichEmbed()
    .setColor([130, 160, 253])
    .setAuthor("Banimento Efetuado!")
    .setDescription(`Banimento efetuado por ${message.author.username}`)
    .addField("Usuário Banido: ", `${kuser} id ${kuser.id}`, false)
    .addField("Banido por: ", `<@${message.author.id}>`, false)
    .addField("Data do ban: ", message.createdAt, false)
    .addField("Motivo: ", `${kreason}`, false)
    .setFooter("Bot Criado pelo Lobo Metalúrgico", client.user.avatarURL)
    .setTimestamp();

  kickChannel.send(embed);
  message.guild.member(kuser).ban(kreason);
}

module.exports.help = {
	name: "Ban",
	aliases: [""],
	description: "Bani um Usuário",
	usage: "[@UserMention]",
	category: "Moderação",
};