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

const si = require('systeminformation');

module.exports = {
  GetCPUModel: async () => {
    return await si.cpu().then(data => {return data;});
  },
  GetComputerModel: async () => {
    return await si.system().then(data => {return data;});
  },
  GetCPUTemp: async () => {
    return await si.cpuTemperature().then(data => {return data;});
  },
  GetMemoryAmount: async () => {
    return await si.mem().then(data => {return data;});
  },
  GetGPUModel: async () => {
    return await si.graphics().then(data => {return data.controllers;});
  },
  GetOSData: async () => {
    return await si.osInfo().then(data => {return data;});
  }
};