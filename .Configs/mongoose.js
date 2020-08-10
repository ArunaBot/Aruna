/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2020

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

var mongoose = require('mongoose');
const config = require('./general.js');
const chalk = require('chalk');
const language = require(`../languages/bot/${config.language}/internal.json`);

var Schema = mongoose.Schema;
const url = config.mongoose;
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) return error(`[${language.main.error}] => ${err}`);
    log('=> Conectado!');
  }
);

var User = new Schema({
  _id: { type: String },
  language: { type: String, default: null },
  SUPER: { type: Boolean, default: false }
});

var Guild = new Schema({
  _id: { type: String },
  prefix: { type: String, default: config.prefix },
  ticketLogID: { type: String, default: null },
  ticketSupportID: { type: String, default: null },
  rankEnable: { type: Boolean, default: false },
  ticketEnable: { type: Boolean, default: false },
  autoRole: { type: Boolean, default: false },
  autoRoleRole: { type: String, default: null },
  language: { type: String, default: 'br' },
  isPremium: { type: Boolean, default: false },
  isPartner: { type: Boolean, default: false }
});

var Rank = new Schema({
  _id: { type: String },
  user: { type: String },
  xp: { type: String },
  level: { type: String },
  guild: { type: String }
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
});

var System = new Schema({
  _id: { type: Number },
  maintenance: { type: Boolean, default: false},
  date: { type: String, default: null },
  time: { type: String, default: null }
});

var Commands = mongoose.model('Commands', Command);
var Supports = mongoose.model('Suport', Support);
var Tickets = mongoose.model('Tickets', Ticket);
var Systems = mongoose.model('System', System);
var Guilds = mongoose.model('Guilds', Guild);
var Users = mongoose.model('Users', User);
var Ranks = mongoose.model('Rank', Rank);

exports.Commands = Commands;
exports.Tickets = Tickets;
exports.Suport = Supports;
exports.System = Systems;
exports.Guilds = Guilds;
exports.Users = Users;
exports.Rank = Ranks;

function logPrefix() {
  return `${chalk.gray('[')}${chalk.blue(language.main.cluster)}${chalk.gray(']')}`;
}

function log(...a) {
  return console.log(logPrefix(), ...a);
}

// eslint-disable-next-line no-unused-vars
function warn(...a) {
  return console.warn(logPrefix(), chalk.yellow(...a));
}

function error(...a) {
  return console.error(logPrefix(), chalk.red(...a));
}

// eslint-disable-next-line no-unused-vars
function debug(...a) {
  return console.debug(logPrefix(), chalk.magenta(...a));
}