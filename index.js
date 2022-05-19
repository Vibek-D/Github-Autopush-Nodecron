const expressApp = require("express");
let app = expressApp();
const cors = require('cors');
const Ddos = require('ddos');
const shell = require('shelljs');
const bodyParser = require('body-parser');
const { whitelist, ddosConfig } = require("./config");

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

const ddosInstance = new Ddos(ddosConfig);

// npm module for preventing ddos attack
app.use(ddosInstance.express);

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

shell.exec('git commit -am "autoCommit"');

app.get('/', (req, res) => {
  res.send("The server was pinged");
})

app.listen(5000, () => console.log(`Server started on port 5000`));

module.exports = app;
