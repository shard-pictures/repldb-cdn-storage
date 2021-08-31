const express = require("express");
const fs = require("fs")
const { SecurePass, VerificationResult } = require('argon2-pass');
const Database = require("@replit/database")
const db = new Database()
const fetch = require('node-fetch');

const genFn = () => {  
  return require('crypto')
    .randomBytes(7)
    .toString('base64')
    .slice(0, 7)
}

fetch(`https://shard.pictures/imalive/${process.env.REPL_OWNER}/${process.env.REPL_SLUG}`)

const app = express();

app.get("/", (req, res) => {
  res.redirect('https://shard.pictures/')
})

app.get("/ping", async (req, res) => {
  res.send(Buffer.byteLength(JSON.stringify(db.getAll())))
})

app.get("/newtoken", (req, res) => {
  let temp_token = req.headers['temp_token']
  fetch('https://shard.pictures/retrieveToken', {
    headers: { 'temp_token': temp_token },
  })
    .then(res => res.text())
    .then(token => {
      let sp = new SecurePass();
      let hashed_token = await sp.hashPassword(Buffer.from(req.headers["token"]));
      db.set("token", hashed_token).then(() => {});
    });
  res.send('Updated!')
})

app.get("/*", (req, res) => {
  db.get(req.path.substring(1)).then((val) => {
    if (val == null) {
      fs.readFile(__dirname + "/static/fileNotFound.png", (err, data) => {
        if(err) {
          console.log(err);
          return
        }
        res.status(307).write(data);
        return res.end();
      })
    } else {
      res.write(Buffer.from(val, "base64"));
      res.end();
    }
  })
})

app.post("/upload", async (req, res) => {
  let sp = new SecurePass();
  let hashed_token = await sp.hashPassword(Buffer.from(req.headers["token"]));
  if (token != hashed_token) {
    return res.status(401).send("You are unauthenticated!")
  }

  const savename = req.headers["savename"]

  //handling new file storage here
  db.set(savename, Buffer.from(req.body, "binary").toString("base64")).then(() => {
    return res.send("upload complete"); // yaya
  });
});

app.listen(3000, () => {
  console.log("server started");
});