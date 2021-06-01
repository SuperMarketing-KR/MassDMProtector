const Discord = require("discord.js.old");
const process = require("process");
const fetch = require("node-fetch");
const config = require("../config/config");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("** SLAVE ** " + client.user.username + " ready!");
});

client.on("message", (msg) => {
  if (!msg.guild && !msg.author.bot) {
    process.send({ userId: msg.author.id });
  }
});

process.on("message", (msg) => {
  client.login(msg.token);
});
