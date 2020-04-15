exports.run = async (aruna, message, prefix, comando) => {
  var content = message.content.slice(comando.length).trim();
  var content = content.slice(4).trim();
  await message.delete();
  await message.channel.send(content);
};

exports.config = {
  name: "say",
  aliases: [],
  category: `🎉 Entretenimento`
};