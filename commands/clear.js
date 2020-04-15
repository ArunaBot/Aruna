function verify(messages, args, message) {
  if (args[0] == messages.size)
    return (
      "Foram deletadas `" +
      messages.size +
      "` mensagens por " +
      `<@${message.author.id}>`
    );
  else
    return (
      `<@${message.author.id}> deletou apenas \`${messages.size}\`` +
      " mensagens das " +
      `\`${args[0]} requisitadas\`` +
      " por não existirem outras ou serem mais antigas que 2 semanas."
    );
}

const config = require('../config.json')

exports.run = async (client, message, args) => {
  if (message.channel.type == "dm")
    return message.reply("Desculpe, este comando não pode ser usado aqui :(");
  if (
    !message.guild.members.get(client.user.id).hasPermission("MANAGE_MESSAGES")
  )
    return message.reply(
      "Para esse comando, eu preciso ter a permissão de `Gerenciar Mensagens`."
    );
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply(
      "Oops, você precisa ter a permissão de ``Gerenciar Mensagens`` para usar esse comando."
    );
  if (!args[0])
    return message.reply(
      "Cite o número de mensagens que deseja deletar, exemplo: ``clear 100``."
    );
  if (args[0] > 100)
    return message.reply(
      "Desculpe, a infeliz da API só permite deletar até 100 mensagens por vez."
    );
  message.delete();
  message.channel.bulkDelete(args[0]).then(messages => {
    message.channel
      .send(verify(messages, args, message))
      .then(msg => msg.delete(10000));
  });
};
