exports.run = (client, message) => {

   var words = ["https://discord/. gg/", "https://discord/ . g g/", "https://discord/ . gg /",
   "h t t p s : / / d i s c o r d . g g /", "discord."]
   
   for (var i=0; i < words.length; i++) {
      let rMember = message.guild.member(message.author)
      if (!rMember.roles.has('609418254741667850')){
         if (message.content.includes(words[i])) {
         message.delete(0)
         message.reply("Convite aqui não. Joinha brother?")
         }
      }
   }
}