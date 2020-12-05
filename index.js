const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");

// server stuff

const app = express();
// using body-parser as middleware
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

// curl http://localhost:3000
app.get("/", (req, res) => {
  res.send("Here is your data");
});

// curl -d "server=initialize" -X POST http://localhost:3000
app.post("/", (req, res) => {
  console.log("Got post request, here is the body:", req.body);
  res.sendStatus(200);
  if (req.body.server) handleServer(req.body);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

// other stuff

const handleServer = (data) => {
  switch (data.server) {
    case "start":
      console.log("starting minecraft server");
      break;
    case "stop":
      console.log("stopping minecraft server");
      break;
    case "initialize":
      console.log("initializing minecraft server");
      downloadFile("https://papermc.io/api/v1/paper/1.16.4/312/download", "./local/server.jar", () =>
        console.log("finished downloading")
      );
      break;
    default:
      console.log("server task is not valid");
      break;
  }
};

const downloadFile = (url, path, callback) => {
  const file = fs.createWriteStream(path);
  https
    .get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close(callback);
      });
    })
    .on("error", (err) => {
      fs.unlink(path);
      console.log(`Error: ${err}`);
    });
};
