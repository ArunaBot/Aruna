var mongoose = require("mongoose");
const config = require('./cf.js')

var Schema = mongoose.Schema;
let url = process.env.MONGOOSE;
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) return console.log("(CLUSTER) => Erro\n", err);
    console.log("(CLUSTER) => Conectado!");
  }
);

var User = new Schema({
  _id: { type: String },
  cmdCooldown: { type: String, default: "0" },
  SUPER: { type: Boolean, default: false }
});

var Guild = new Schema({
  _id: { type: String },
  prefix: { type: String, default: config.prefix },
  ticketCategoryID: { type: String, default: null },
  ticketLogID: { type: String, default: null },
  ticketSupportID: { type: String, default: null },
  rankEnable: { type: Boolean, default: false },
  ticketEnable: { type: Boolean, default: false },
  autoRole: { type: Boolean, default: false },
  autoRoleRole: { type: String, default: null }
});

var Rank = new Schema({
  _id: { type: String },
  user: { type: String },
  xp: { type: String },
  level: { type: String },
  guild: { type: String }
});

var Comando = new Schema({
  _id: { type: String }
});

var Ticket = new Schema({
  _id: { type: String },
  owner: { type: String },
  date: { type: String },
  guild: { type: String },
  channel: { type: String }
});

var Support = new Schema({
  user: { type: String },
  guild: { type: String },
  stats: { type: Boolean, default: false }
});

var Command = new Schema({
  _id: { type: String },
  name: { type: String },
  public: { type: Boolean, default: false }
})

var Commands = mongoose.model("Commands", Command);
var Support = mongoose.model("Suport", Support);
var Tickets = mongoose.model("Tickets", Ticket);
var Guilds = mongoose.model("Guilds", Guild);
var Users = mongoose.model("Users", User);
var Rank = mongoose.model("Rank", Rank);

exports.Commands = Commands;
exports.Suport = Support;
exports.Tickets = Tickets;
exports.Guilds = Guilds;
exports.Users = Users;
exports.Rank = Rank;