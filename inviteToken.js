const Token = require("./discord/token");
const fetch = require("node-fetch");
const config = require("./config/config");

Token.readTokens().forEach((e) => {
  fetch("https://discord.com/api/v8/invites/" + config.INVITE, {
    method: "POST",
    headers: {
      Authorization: e,
    },
  });
});
