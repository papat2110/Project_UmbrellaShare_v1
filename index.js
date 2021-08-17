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

app.post("/user", async (req, res) => {
  let user = await new User({name:"aaa"}).save()
  console.log(user);
  res.send(user);
});

app.post('/writestt/:id/:stt',cors(), async (req, res) =>{
  var strParseWriteReq = JSON.stringify(req.params)
  var strWriteReq = JSON.parse(strParseWriteReq)
  id = strWriteReq.id
  stt = strWriteReq.stt
  let sstusr = await new Status({userid:id,status:stt}).save()
  console.log(sstusr);
  res.send(sstusr);
});


