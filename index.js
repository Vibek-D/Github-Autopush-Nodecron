const expressApp = require("express");
let app = expressApp();
const fs = require("fs");
const cors = require("cors");
const Ddos = require("ddos");
const shell = require("shelljs");
const cron = require("node-cron");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const { whitelist, ddosConfig } = require("./config");

function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const ddosInstance = new Ddos(ddosConfig);
const corsOptions = {
  exposedHeaders: "authorization, x-refresh-token, x-token-expiry-time",
  origin: (origin, callback) => {
    if (!whitelist || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// npm module for preventing ddos attack
app.use(ddosInstance.express);

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

cron.schedule("*/1 * * * *", () => {
  console.log("Running a task every minute");
  
  let data = `\nNew commit ${randomNumberInRange(1, 10)}`;
  fs.appendFileSync("githubPushFile.txt", data, "utf8");

  let randomPushGithub = Math.floor(Math.random() * (3 - 1) + 1);
  if (randomPushGithub === 1) {
    shell.exec(
      `git add githubPushFile.txt && git commit -m "autoCommit ${shortid.generate()}" && git push origin master`
    );
  }
});

app.get("/", (req, res) => {
  res.send("The server was pinged");
});

app.listen(5000, () => console.log(`Server started on port 5000`));

module.exports = app;
