var database = require("../configs/mongoose.js");

exports.run = async (aruna, guild) => {
  var saveG = await database.Guilds.findOneAndDelete({ _id: guild.id });
  console.log('Server Removed :(')
};