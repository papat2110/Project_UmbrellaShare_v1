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
const Realtime = require("./models/RealtimeUmbrella");
const Locker = require("./models/Locker");
const Place = require("./models/Place");
const jwt = require('jsonwebtoken');

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

//add user
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

//add place
app.post("/addplace/:location/:place/:node_ip", async (req, res) => {
  var location = req.params.location;
  var place = req.params.place;
  var node_ip = req.params.node_ip;
  var addplace = await new Place({location:location,place:place,node_ip:node_ip}).save()
  console.log(addplace);
  res.send(addplace);
});

//add umbrella
app.get("/addumbrella/:rfid/:status", async (req, res) => {
  var rfid = req.params.rfid;
  var status = req.params.status;
  var addumbrella = await new Umbrella({rfid:rfid,status:status}).save()
  console.log(addumbrella);
  res.send(addumbrella);
});

//inform broken umbrella
app.get("/inform_umbrella/:user_id/:rfid/:status/:place", async (req, res) => {
  var rfid = req.params.rfid;
  var status = req.params.status;
  var place = req.params.place;
  var user = req.params.user_id;
  var umbrella = await Umbrella.findOne({rfid:rfid});
  if(umbrella){
    var query = {_id:umbrella._id};
    await Umbrella.findOneAndUpdate(query,{status:status,place:place,user:user});
    console.log(umbrella);
    res.send(umbrella);
  }else if(!umbrella){
    res.send("something wrong");
  }
});

//edit password
app.post("/change_pass/:user_id/:old_password/:new_password", async (req, res) => {
  var user_id = req.params.user_id;
  var old_password = req.params.old_password;
  var new_password = req.params.new_password;
  let user = await User.findOne({p_id:user_id});
  let query = {_id:user._id};
  
  if(old_password == user.password){
    await User.findOneAndUpdate(query,{password:new_password});
    console.log("changed password");
    res.send("changed password");
  }else if(old_password != user.password){
    res.send("old password not correct");
  }else{
    res.send("something wrong");
  }

});

//login
app.post("/login/:email/:password", async (req, res) => {
  var email = req.params.email;
  var password = req.params.password;
  let email_c = await User.findOne({email:email});
  if(email_c){
    // res.send("correct email");
    let password_c = await User.findOne({email:email,password:password});
    if(password_c){
      res.send(password_c);
      console.log(password_c);
    }else{
      res.send("incorrect password");
      console.log(password_c);
    }
  }else{
    res.send("incorrect email");
  }
});

//get user
app.post("/user/:user_id", async (req, res) => {
  var user_id = req.params.user_id;
  let user = await User.findOne({p_id:user_id});
  if(user){
    res.send(user);
  }else{
    res.send("incorrect user id");
  }
});

//realtime request
app.get('/writestt/:id/:stt/:place', async (req, res) => {
  let userid = req.params.id;
  let status = req.params.stt;
  let place = req.params.place;
  let user = await User.findOne({p_id:userid});
  // res.send(user);
  if(user){
    let userstatus = await new Status({userid:userid,status:status,place:place}).save()
    console.log("correct ID");
    res.send("correct ID");
  }
  if(!user){
    res.send(user);
  }
});

//delete status
app.get('/getstt/:place', async (req, res) => {
  // let userid = req.params.id;
  // let status = req.params.stt;
  let place = req.params.place;
  let user = await Status.findOne({place:place});
  // res.send(user);
  if(user){
    console.log(user);
    res.send(user._id+"\n$$"+user.userid+"\n"+user.status+"\n"+user.place);
  }
  if(!user){
    res.send(user);
  }
});

app.get('/delete_stt/:place', async (req, res) => {
  // let userid = req.pearams.id;
  // let status = req.params.stt;
  let place = req.params.place;
  let user = await Status.findOne({place:place});
  // res.send(user);
  if(user){
    console.log(user);
    await Status.findByIdAndDelete(user._id);
    res.send("blank");
  }
  if(!user){
    res.send("error");
  }
});

//borrow umbrella
app.get('/borrow/:user_id/:umbrella_id/:borrow_time/:borrow_place/:getting_time/:getting_place/:status', async (req, res) => {
  let user_id = req.params.user_id;
  let umbrella_id = req.params.umbrella_id;
  // let borrow_time = req.params.borrow_time;
  let borrow_time = Date.now();
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

//checked umbrella_id
app.get('/umbrella/:node_ip/:umbrella_id/:request', async (req, res) => {
  let node_ip= req.params.node_ip;
  let umbrella_id = req.params.umbrella_id;
  let request = req.params.request;
  let umbrella = await Umbrella.findOne({rfid:umbrella_id});
  // res.send(user);
  if(umbrella){
    let realtime = await new Realtime({node_ip:node_ip,umbrella_id:umbrella_id,request:request}).save()
    console.log(realtime);
    res.send(realtime);
  }
  if(!umbrella){
    res.send("error");
  }
});

//get umbrella_id
app.get('/get_umbrella/:node', async (req, res) => {
  let node_ip = req.params.node;
  let umbrella = await Realtime.findOne({node_ip:node_ip}).sort({ _id: -1 }).limit(10);
  if(umbrella){
    res.send("@node : "+node_ip+"\n#"+umbrella.umbrella_id+"\n%%"+umbrella.request);
  }else{
    res.send("error get umbrella id");
  }
  // let umbrella = await Realtime.find();
});


// app.get('/get_umbrellaa', async (req, res) => {
//   // let node_ip = req.params.node_ip;
//   let umbrella = await Realtime.find();
//   res.send(umbrella);
//   // await Realtime.findByIdAndDelete(umbrella._id);
// });

//delete realtime
app.get('/delete_realtime/:node_ip', async (req, res) => {
  let node_ip = req.params.node_ip;
  let realtime = await Realtime.findOne({node_ip:node_ip});
  // res.send(user);
  if(realtime){
    console.log(realtime);
    await Realtime.findByIdAndDelete(realtime._id);
    res.send("blank");
  }
  if(!realtime){
    res.send("error");
  }
});

//getting umbrella
app.get('/getborrow/:user_id/:umbrella_id/:getting_time/:getting_place/:status', async (req, res) => {
  let user_id = req.params.user_id;
  let umbrella_id = req.params.umbrella_id;
  let borrow_data = await Borrow.findOne({user_id:user_id,umbrella_id:umbrella_id}).sort({ _id: -1 }).limit(10);
  // res.send(user);
  if(borrow_data){
    let query = {_id:borrow_data._id};
    // let getting_time = req.params.getting_time;
    let getting_time = Date.now();
    let getting_place = req.params.getting_place;
    let time = getting_time - borrow_data.borrow_time;
    let status = req.params.status;
    
    await Borrow.findOneAndUpdate(query,{getting_time:getting_time,getting_place:getting_place,time:time,status:status});

    console.log("update success");
    res.send("update success");
  }
  if(!borrow_data){
    res.send("update fail");
  }
});

//show borrow history
app.get('/history/:type/:user_id', async (req, res) => {
  let user_id = req.params.user_id;
  let type = req.params.type;
  if(type == "borrow"){
    let borrow_history = await Borrow.find({user_id:user_id});
    console.log(borrow_history);
    res.send(borrow_history);
  }
  else if(type == "deposit"){
    let deposit_history = await Deposit.find({user_id:user_id});
    console.log(deposit_history);
    res.send(deposit_history);
  }else{
    res.send("can't find information");
  }
});

//deposit umbrella
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

//return umbrella
app.get('/getdeposit/:user_id/:locker/:return_time/:return_place/:status', async (req, res) => {
  let user_id = req.params.user_id;
  let locker = req.params.locker;
  let deposit_data = await Deposit.findOne({user_id:user_id,locker:locker}).sort({ _id: -1 }).limit(10);
  // res.send(user);
  if(deposit_data){
    let query = {_id:deposit_data._id};
    let return_time = req.params.return_time;
    let return_place = req.params.return_place;
    let time = return_time - deposit_data.deposit_time;
    let status = req.params.status;
    
    await Deposit.findOneAndUpdate(query,{return_time:return_time,return_place:return_place,time:time,status:status});

    console.log("update success");
    res.send("update success");
  }
  if(!deposit_data){
    res.send("update fail");
  }
});

//add locker
app.get("/addlocker/:node_ip/:locker/:degree/:locker_status", async (req, res) => {
  var node_ip = req.params.node_ip;
  var locker = req.params.locker;
  var degree = req.params.degree;
  var locker_status = req.params.locker_status;
  var addlocker = await new Locker({node_ip:node_ip,locker:locker,degree:degree,locker_status:locker_status}).save()
  console.log(addlocker);
  res.send(addlocker);
});

//add locker
app.get("/getlocker/:node_ip", async (req, res) => {
  var node_ip = req.params.node_ip;
  // var getlocker = await Locker.find({node_ip:node_ip});
  var show = "";
  for(let i = 1; i <= 8; i++){
    var locker = await Locker.findOne({node_ip:node_ip,locker:i});
    var degree = locker.degree;
    var locker_status = locker.locker_status;
    show = show + ("$"+locker.locker+":"+locker_status+"\n");
  }
  // res.send(getlocker.locker);
  console.log(show);
  res.send(show);
});