exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.reply(
      "Oops, você precisa ter a permissão de ``Gerenciar Mensagens`` para usar esse comando."
    );
  const debug = message.content.slice(5).trim();
  await message.channel.send(debug);
  await message.delete(0);
};
