const db = require('quick.db')
const config = require("../config.json")

exports.run = async (client, message, args) => { 
  
  const guild = message.guild
  
  var prefix = await db.fetch(`prefix_${guild.id}`);
  
  if (prefix === null) {
    prefix = config.prefix
  }
  
  else if (prefix === "default" || prefix === "Default") {
    prefix = config.prefix
  }
  
  const argsnull = `Olá, <@${message.author.id}>. Meu prefixo nesta guild é ` + "``" + prefix + "``." + ` Para definir um novo prefixo, use \`${prefix}prefix set <prefix>\`. Para remover, use \`${prefix}prefix remove\`.`
        
  if(!args[0]) return message.channel.send(argsnull)
  
  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.reply(
      "Oops, você precisa ter a permissão de ``Gerenciar Servidor`` para usar esse comando."
    );
  
  if(args[0] === "set") {
    
    if(!args[1]) return message.channel.send(argsnull)
    
    await db.set(`prefix_${guild.id}`, args[1])
    await message.reply(`Prefixo definido para \`${db.fetch(`prefix_${guild.id}`)}\` com sucesso!`)
  } else if(args[0] === "remove"){
    await db.set(`prefix_${guild.id}`, "default")
    await message.reply(`Prefixo redefinido para \`-\` com sucesso!`)
  } else message.channel.send(argsnull)
}