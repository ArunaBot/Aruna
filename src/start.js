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

const { advanced } = require('../Configs');

async function loadModules() {
  if (advanced.ws.enabled) {
    await require('./main/API/WebSocket/main').start().catch((error) => {
      console.exception('Error! The WebSocket could not be initialized:', error);
      process.exit(-1);
    });
  }
  if (advanced.modules.discord.enabled) {
    await require('./main/Discord/sharding.js').start().catch((error) => {
      console.error('Error! The Discord Module could not be initialized:', error);
      process.exit(1);
    });
  }
  if (advanced.modules.twitch.enabled) {
    await require('./main/Twitch/src/initial').start().catch((error) => {
      console.error('Error! The Twitch Module could not be initialized:', error);
      process.exit(2);
    });
  }
}

loadModules();