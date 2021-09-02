const Database = require("@replit/database")
const db = new Database()

db.get("token").then(value => {
  console.log(value)
});