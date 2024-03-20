const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/codeialDb");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "error in db"));
db.once("open", function () {
  console.log("Succesfully connected to DB");
});

module.exports= db;