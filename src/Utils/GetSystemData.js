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