const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("./models/User");
const Status = require("./models/Status");

var mongo_uri = "mongodb+srv://admin:1234@umbrellashare01.pk99m.mongodb.net/UmbrellaShare?retryWrites=true&w=majority"


mongoose.Promise = global.Promise
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(
  () => {
    console.log("success connected database");
  },
  error => {
    console.log("failed connection");
    process.exit();
  }
)

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:80`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get((req, res, next) => {
  var err = new error("sorry don't find path");
  err.status = 404;
  next(err);
});

app.get("/user", async (req, res) => {
  let user = await User.find();
  console.log(user);
  res.send(user);
});

app.post("/adduser/:name/:email/:tel/:password/:pid", async (req, res) => {
  var name = req.params.name;
  var email = req.params.email;
  var tel = req.params.tel;
  var password = req.params.password;
  var p_id = req.params.pid;
  var adduser = await new User({name:name,email:email,tel:tel,password:password,p_id:p_id}).save()
  console.log(adduser);
  res.send(adduser);
});

app.get('/writestt/:id/:stt', async (req, res) => {
  let userid = req.params.id;
  let status = req.params.stt;
  let user = await User.findOne({p_id:userid});
  res.send(user);
  if(!user){
    let userstatus = await new Status({userid:userid,status:status}).save()
  }
  console.log(userstatus);
  res.send(userstatus);
});


