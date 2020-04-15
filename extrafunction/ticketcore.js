const db = require("quick.db");

exports.run = async (
  client,
  message,
  channelID,
  m,
  ticketcategory,
  ticketlog,
  add
) => {
  const userID = message.author.id;
  const guild = message.guild;
  const eChannel = client.channels.get(channelID);

  let ticket = await db.fetch(`ticket.${guild.id}.${userID}`);

  if (ticket == null) {
    if (ticket === null) ticket = 0;
    db.set(`ticket.${guild.id}.${userID}`, channelID);
    eChannel.setParent(ticketcategory);
    eChannel.send(
      `Obrigado por entrar em contato, <@${userID}>. Este é o canal criado para que você possa retirar sua dúvida.`
    );
    m.edit(
      `Canal Criado com Sucesso! Acesse agora mesmo o canal <#${channelID}> para poder receber o auxílio adequado.`
    );
    ticketlog.send(
      `O usuário <@${userID}> acaba de criar o ticket \`${add}\` (${eChannel})`
    );
  } else {
    m.edit(
      `Ops! Você já tem um ticket aberto. Localize-o na categoria "Tickets" abaixo de todos os canais.`
    );
    eChannel.delete();
  }
};
