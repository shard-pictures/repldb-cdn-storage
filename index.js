const express = require("express");
const fs = require("fs")
const Database = require("@replit/database")
const db = new Database();
const fetch = require('node-fetch');
const sizeof = require('object-sizeof')
const { exec } = require("child_process");

const genFn = () => {  
  return require('crypto')
    .randomBytes(7)
    .toString('base64')
    .slice(0, 7)
}

fetch(`https://shard.pictures/imalive/${process.env.REPL_OWNER}/${process.env.REPL_SLUG}`).then(res => res.text()).then(body => console.log(body));
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect('https://shard.pictures/')
})

app.get("/ping", async (req, res) => {
  let size = await sizeof(await db.getAll()).toString();
  console.log(`Current size of the db is: ${size}`)
  res.send(size)
})

app.get("/update", async (req, res) => {
  let token = await db.get('token')
  if (req.headers["token"] != token) {
    res.status(401).send("You are unauthenticated!")
    return
  }
  exec('bash update.sh', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  })
  process.exit();
})

app.get("/newtoken", (req, res) => {
  let temp_token = req.headers['temp_token']
  fetch('https://shard.pictures/retrieveToken', {
    headers: { 'temp_token': temp_token, 'repl_owner': process.env.REPL_OWNER, 'repl_slug': process.env.REPL_SLUG },
  })
    .then(res => res.text())
    .then(async token => {
      db.set("token", token).then(() => {});
    });
  res.send('Updated!')
})

app.get("/filenames", async (req, res) => {
  let values = await db.list()
  await values.splice(values.indexOf('token'), 1)
  res.send(values)
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
      console.log("Returned " + req.path.substring(1))
      res.write(val);
      res.end();
    }
  })
})

app.post("/upload", async (req, res) => {
  let token = await db.get('token')
  if (req.headers["token"] != token) {
    res.status(401).send("You are unauthenticated!")
    return
  }

  let content = req.body;
  let savename = content['savename'].split("_")[2]
  let data = content['data']

  //handling new file storage here
  db.set(savename, data).then(() => {
    console.log("Uploaded " + savename)
    return res.send("upload complete"); // yaya
  });
});

//poop :flushed:

app.listen(3000, () => {
  console.log("(/◕ヮ◕)/");
});

