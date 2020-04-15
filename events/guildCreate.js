var database = require("../configs/mongoose.js");

exports.run = async (aruna, guild) => {
  var saveG = await new database.Guilds({ _id: guild.id });
  await saveG.save();
  console.log('New Server Entry! :)')
};
