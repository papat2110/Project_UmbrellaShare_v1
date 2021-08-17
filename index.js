const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/umbrellaserver", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("connected true");
    },
    (error) => {
      console.log("connected error");
      process.exit();
    }
  );

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user", async (req, res) => {
  let user = await User.find();
  console.log(user);
  res.send(user);
});

app.post("/user", async (req, res) => {
  let user = await new User({name:"aaa"}).save()
  console.log(user);
  res.send(user);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
