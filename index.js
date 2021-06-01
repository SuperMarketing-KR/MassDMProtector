const cluster = require("cluster");
const process = require("process");
const Token = require("./discord/token");

if (cluster.isMaster) {
  let workers = [];
  Token.readTokens().forEach((token) => {
    let worker = cluster.fork();
    workers.push(worker);
    worker.send({ token: token });
  });
  require("./discord/master").setWorkers(workers);
} else {
  require("./discord/slave");
}
