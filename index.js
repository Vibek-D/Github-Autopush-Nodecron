const expressApp = require("express");
let app = expressApp();
const fs = require("fs");
const cors = require("cors");
const Ddos = require("ddos");
const shell = require("shelljs");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const { whitelist, ddosConfig } = require("./config");

function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

console.log(randomNumberInRange(1, 10));

let data = `\nNew commit ${randomNumberInRange(1, 10)}`;
fs.appendFile("githubPushFile.txt", data, "utf8", function (err) {
  if (err) throw err;
  console.log("Data is appended to file successfully");
});

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

cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});

shell.exec('git commit -am "autoCommit"');

app.get("/", (req, res) => {
  res.send("The server was pinged");
});

app.listen(5000, () => console.log(`Server started on port 5000`));

module.exports = app;
