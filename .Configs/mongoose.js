/*
    This File is part of ArunaBot
    Copyright (C) LoboMetalurgico (and contributors) 2019-2021

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
    log(language.generic.connected);
  }
);

const User = new Schema({
  _id: { type: String },
  language: { type: String, default: null },
  SUPER: { type: Boolean, default: false }
});

const Guild = new Schema({
  _id: { type: String },
  prefix: { type: String, default: config.prefix },
  antiFakeEnable: { type: Boolean, default: true },
  ticketLogID: { type: String, default: null },
  ticketSupportID: { type: String, default: null },
  rankEnable: { type: Boolean, default: false },
  ticketEnable: { type: Boolean, default: false },
  antiInviteEnable: { type: Boolean, default: false },
  autoRoleEnable: { type: Boolean, default: false },
  autoRoleRole: { type: String, default: null },
  language: { type: String, default: config.language },
  isPremium: { type: Boolean, default: false },
  isPartner: { type: Boolean, default: false }
});

const AntiInvite = new Schema({
  _id: { type: String },
  usersExcluded: { type: Array, default: [] },
  rolesExcluded: { type: Array, default: [] },
  channelsExcluded: { type: Array, default: [] },
  invitesExcluded: { type: Array, default: [] }
});

const Rank = new Schema({
  _id: { type: String },
  user: { type: String },
  xp: { type: String },
  level: { type: String },
  guild: { type: String }
});

const Ticket = new Schema({
  _id: { type: String },
  owner: { type: String },
  date: { type: String },
  guild: { type: String },
  channel: { type: String }
});

const Support = new Schema({
  user: { type: String },
  guild: { type: String },
  stats: { type: Boolean, default: false }
});

const Command = new Schema({
  _id: { type: String },
  public: { type: Boolean, default: false }
});

const System = new Schema({
  _id: { type: Number },
  maintenance: { type: Boolean, default: false},
  date: { type: String, default: null },
  time: { type: String, default: null }
});

const AntiInvites = mongoose.model('AntiInvite', AntiInvite);
const Commands = mongoose.model('Commands', Command);
const Supports = mongoose.model('Suport', Support);
const Tickets = mongoose.model('Tickets', Ticket);
const Systems = mongoose.model('System', System);
const Guilds = mongoose.model('Guilds', Guild);
const Users = mongoose.model('Users', User);
const Ranks = mongoose.model('Rank', Rank);

exports.AntiInvite = AntiInvites;
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
