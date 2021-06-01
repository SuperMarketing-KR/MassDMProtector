const Discord = require("discord.js");
const config = require("../config/config");

let workers, timeout;
let data = {},
  tmpData = [];
const client = new Discord.Client();

client.on("ready", () => {
  console.log("** MASTER ** " + client.user.username + " ready!");
});

client.on("guildMemberAdd", (member) => {
  if (timeout) clearTimeout(timeout);
  tmpData.push(member.id);
  setTimeout(handleTimeout, config.TIME * 1000);
});
client.login(config.BOT_TOKEN);

async function banUsers(guildId, users) {
  try {
    let guild = await client.guilds.fetch(guildId);
    users.forEach(async (userId) => {
      try {
        let user = guild.member(userId);
        if (user) {
          await user.ban();
        }
      } catch (err) {}
    });
  } catch (err) {}
}

async function kickUsers(guildId, users) {
  try {
    let guild = await client.guilds.fetch(guildId);
    users.forEach(async (userId) => {
      try {
        let user = guild.member(userId);
        if (user) {
          await user.kick();
        }
      } catch (err) {}
    });
  } catch (err) {}
}

function handleTimeout() {
  timeout = undefined;
  if (tmpData.length > 1) {
    data[+new Date()] = tmpData;
  }
  tmpData = [];
}

function handleMessage(msg) {
  let { userId } = msg;
  if (!userId) return;
  banUsers(config.GUILD_ID, [userId]);
  console.log("DM Detected, user " + userId + " banned.");
  Object.keys(data).forEach((key) => {
    if (data[key].indexOf(userId) !== -1) {
      console.log(data[key].length - 1 + " user(s) kicked.");
      kickUsers(config.GUILD_ID, data[key]);
      delete data[key];
    }
  });
  if (tmpData.indexOf(userId) !== -1) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    console.log(tmpData.length - 1 + " user(s) kicked.");
    kickUsers(config.GUILD_ID, tmpData);
    tmpData = [];
  }
}

module.exports = {
  setWorkers: (w) => {
    workers = w;
    workers.forEach((worker) => {
      worker.on("message", handleMessage);
    });
  },
};
