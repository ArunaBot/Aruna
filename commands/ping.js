exports.run = async (client, message, args) => {
  const m = await message.channel.send("Calculando...");
  m.edit(
    `Pong :ping_pong:! \nA latência é de **${m.createdTimestamp -
      message.createdTimestamp}** ms! \nLatência da API é de **${Math.round(
      client.ping
    )}** ms.`
  );
};

module.exports.help = {
	name: "ping",
	aliases: [""],
	description: "Pong",
	usgae: "ping",
	category: "Geral",
};