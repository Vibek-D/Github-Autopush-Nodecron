const app = require("express");
const cors = require('cors');
const Ddos = require('ddos');
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

app.listen(5000, () => logger.info(`Server started on port ${port}`));

module.exports = app;
