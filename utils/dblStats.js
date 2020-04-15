exports.run = async aruna => {

  const DBL = require("dblapi.js");
  const dbl = new DBL(`${process.env.TOKEN_DBL}`, aruna);

  dbl.on("posted", () => {
    console.log("(DBL) => Server count posted!");
  });

  dbl.on("error", e => {
    console.log(`(DBL) => Oops! ${e}`);
  });

  setInterval(() => {
    dbl.postStats(aruna.guilds.size);
  }, 900000);
};
