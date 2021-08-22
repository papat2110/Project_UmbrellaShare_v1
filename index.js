const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const User = require("./models/User");
const Status = require("./models/Status");
const Borrow = require("./models/Borrow");
const Deposit = require("./models/Deposit");
const Umbrella = require("./models/Umbrella");

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
  // res.send(user);
  if(user){
    res.send("correct id");
    let userstatus = await new Status({userid:userid,status:status}).save()
    console.log(userstatus);
    res.send(userstatus);
  }
  if(!user){
    res.send(user);
  }
});

app.get('/borrow/:user_id/:umbrella_id/:borrow_time/:borrow_place/:getting_time/:getting_place/:status', async (req, res) => {
  let user_id = req.params.user_id;
  let umbrella_id = req.params.umbrella_id;
  let borrow_time = req.params.borrow_time;
  let borrow_place = req.params.borrow_place;
  let getting_time = req.params.getting_time;
  let getting_place = req.params.getting_place;
  let time = getting_time - borrow_time;
  let status = req.params.status;

  let borrow = await new Borrow({user_id:user_id,umbrella_id:umbrella_id,borrow_time:borrow_time,
    borrow_place:borrow_place,getting_time:getting_time,getting_place:getting_place,time:time,status:status}).save()
  console.log(borrow);
  res.send(borrow);
});

app.get('/deposit/:user_id/:locker/:deposit_time/:deposit_place/:return_time/:return_place/:status', async (req, res) => {
  let user_id = req.params.user_id;
  let locker = req.params.locker;
  let deposit_time = req.params.deposit_time;
  let deposit_place = req.params.deposit_place;
  let return_time = req.params.return_time;
  let return_place = req.params.return_place;
  let status = req.params.status;
  let time = return_time - deposit_time;
  let deposit = await new Deposit({user_id:user_id,locker:locker,deposit_time:deposit_time,
    deposit_place:deposit_place,return_time:return_time,return_place:return_place,time:time,status:status}).save()
  console.log(deposit);
  res.send(deposit);
});


