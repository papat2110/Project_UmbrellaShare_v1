const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/DHT22", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("connected true");
    },
    (error) => {
      console.log("connected error");
      process.exit()
    }
  );

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
