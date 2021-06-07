const fs = require("fs");
const config = require("../config/config");

module.exports = {
  readTokens: () => {
    return (
      fs
        .readFileSync(config.TOKEN_PATH, "utf-8")
        .trim()
        // .split("\n")
        .split(/\r?\n/)
        .map((e) => {
          if (e.split(":").length == 3) return e.split(":")[2];
          return e;
        })
    );
  },
};
