const { Command } = require("lobo-classes");

module.exports = class Invite extends Command {

  get name() { return "invite"; }
  get aliases() { return ["✉", "botinvite", "botinv", "inv"]; }
  get cooldown() { return 0; }

  exec(message) {
    message.channel.send(`Me convide com qualquer um destes links!\n${this.client.util.linkList(this.client.config.invites)}`);
  }

  get helpMeta() {
    return {
      category: "Geral",
      description: "Obtém um link para convidar o bot."
    };
  }
};