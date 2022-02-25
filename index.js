const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
var multer = require("multer");
var upload = multer();
const nodemailer = require("nodemailer");

const User = require("./models/User");
const Status = require("./models/Status");
const Borrow = require("./models/Borrow");
const Deposit = require("./models/Deposit");
const Umbrella = require("./models/Umbrella");
const Realtime = require("./models/RealtimeUmbrella");
const Locker = require("./models/Locker");
const Place = require("./models/Place");
const Picture = require("./models/Picture");
const Brokennoti = require("./models/Brokennoti");
const Rotation = require("./models/Rotation");
const jwt = require("jsonwebtoken");

var mongo_uri =
  "mongodb+srv://admin:1234@umbrellashare01.pk99m.mongodb.net/UmbrellaShare?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose
  .connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log("success connected database");
    },
    (error) => {
      console.log("failed connection");
      process.exit();
    }
  );

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "15MB" }));

app.use(upload.array());
app.use(express.static("public"));

var port = process.env.PORT || 80;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    // ข้อมูลการเข้าสู่ระบบ
    user: "umbrellasharekku@gmail.com", // email user ของเรา
    pass: "umbrellashareproject", // email password
  },
});

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
  // เริ่มทำการส่งอีเมล
  let info = await transporter.sendMail({
    from: '"Umbrella Share KKU" <umbrellasharekku@gmail.com>', // อีเมลผู้ส่ง
    to: email, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
    subject: "Verify your email address", // หัวข้ออีเมล
    text: "Please verify your email address", // plain text body
    html:
      '<h2>click link to verify your email address</h2><br><a href="https://umbrellashareserver.herokuapp.com/verify_email/' +
      name +
      "/" +
      email +
      "/" +
      tel +
      "/" +
      password +
      "/" +
      p_id +
      '">verify</a>', // html body
  });
  // log ข้อมูลการส่งว่าส่งได้-ไม่ได้
  console.log("Message sent: %s", info.messageId);
  // console.log(adduser);
  res.send("Message sent: %s", info.messageId);
});

app.get("/verify_email/:name/:email/:tel/:password/:pid", async (req, res) => {
  var name = req.params.name;
  var email = req.params.email;
  var tel = req.params.tel;
  var password = req.params.password;
  var p_id = req.params.pid;
  var adduser = await new User({
    name: name,
    email: email,
    tel: tel,
    password: password,
    p_id: p_id,
  }).save();
  console.log("verify success");
  res.send("verify success");
});

//add place
app.post("/addplace/:latitude/:longitude/:place/:node_ip", async (req, res) => {
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  var place = req.params.place;
  var node_ip = req.params.node_ip;
  var addplace = await new Place({
    latitude: latitude,
    longitude: longitude,
    place: place,
    node_ip: node_ip,
  }).save();
  console.log(addplace);
  res.send(addplace);
});

//edit place
app.get("/edit_place/:lat/:long/:place/:mac_address", async (req, res) => {
    var lat = req.params.lat;
    var long = req.params.long;
    var place = req.params.place;
    var mac_address = req.params.mac_address;
    // console.log(place);
    // res.send(place);
    var place_change = await Place.findOne({ node_ip: mac_address });
    if (place_change) {
      var query = { _id: place_change._id };
      await Place.findOneAndUpdate(query, {
        latitude: lat,
        longitude: long,
        place: place,
        node_ip: mac_address
      });
      console.log("update success");
      res.send("update success");
    } else if (!place_change) {
      console.log("something wrong");
      res.send("something wrong");
    }
});

app.get("/um_place", async (req, res) => {
  let place = await Place.find();
  console.log(place);
  res.send(place);
});

//borrow_sum
app.get("/borrow", async (req, res) => {
  let borrow = await Borrow.find();
  console.log(borrow);
  res.send(borrow);
});

//deposit_sum
app.get("/deposit", async (req, res) => {
  let deposit = await Deposit.find();
  console.log(deposit);
  res.send(deposit);
});

//get picture
app.get("/picture", async (req, res) => {
  let picture = await Picture.find();
  console.log(picture);
  res.send(picture);
});

//get picture
app.get("/picture_1/:borrow_id", async (req, res) => {
  var borrow_id = req.params.borrow_id;
  let picture = await Picture.find({ borrow_id: borrow_id });
  console.log(picture);
  res.send(picture);
});

//get brokennoti
app.get("/broken", async (req, res) => {
  let broken = await Brokennoti.find();
  console.log(broken);
  res.send(broken);
});

//add umbrella
app.get("/addumbrella/:user_id/:rfid/:status/:place/:noti_sst", async (req, res) => {
    var rfid = req.params.rfid;
    var status = req.params.status;
    var place = req.params.place;
    var user = req.params.user_id;
    var noti_sst = req.params.noti_sst;
    var photo = "none";
    var addumbrella = await new Umbrella({
      rfid: rfid,
      status: status,
      place: place,
      user: user,
      noti_sst: noti_sst,
      photo: photo,
    }).save();
    console.log(addumbrella);
    res.send(addumbrella);
  }
);

//get umbrella
app.get("/get_umbrella", async (req, res) => {
  let umbrella = await Umbrella.find();
  console.log(umbrella);
  res.send(umbrella);
});

//edit umbrella
app.get(
  "/edit_umbrella/:user_id/:rfid/:status/:place/:img",
  async (req, res) => {
    var rfid = req.params.rfid;
    var status = req.params.status;
    var place = req.params.place;
    var user = req.params.user_id;
    var photo = req.params.img;
    var umbrella = await Umbrella.findOne({ rfid: rfid });
    if (umbrella) {
      var query = { _id: umbrella._id };
      await Umbrella.findOneAndUpdate(query, {
        status: status,
        place: place,
        user: user,
        photo: photo,
      });
      console.log("update success");
      res.send("update success");
    } else if (!umbrella) {
      res.send("something wrong");
    }
  }
);

//delete umbrella
app.get("/delete_umbrella/:rfid", async (req, res) => {
  var rfid = req.params.rfid;
  var umbrella = await Umbrella.findOne({ rfid: rfid });
  if (umbrella) {
    await Status.findByIdAndDelete(umbrella._id);
    console.log("delete complete");
    res.send("delete complete");
  }
  if (!umbrella) {
    res.send("error");
  }
});

//inform broken umbrella
app.post(
  "/inform_umbrella/:user_id/:rfid/:status/:place/:img",
  async (req, res) => {
    var rfid = req.params.rfid;
    var status = req.params.status;
    var place = req.params.place;
    var user = req.params.user_id;
    var noti_sst = "send";
    var photo = req.params.img;
    var sendnoti = await new Brokennoti({
      rfid: rfid,
      broken: status,
      place: place,
      user: user,
      noti_sst: noti_sst,
    }).save();
    var umbrella = await Umbrella.findOne({ rfid: rfid });
    if (umbrella) {
      var query = { _id: umbrella._id };
      await Umbrella.findOneAndUpdate(query, {
        status: status,
        place: place,
        user: user,
        noti_sst: noti_sst,
        photo: photo,
      });
      let info = await transporter.sendMail({
        from: '"Umbrella "' + umbrella.rfid + '" is broken" <' + user + ">", // อีเมลผู้ส่ง
        to: "papatsorndawthaisong@kkumail.com", // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: "New Broken from user id" + user, // หัวข้ออีเมล
        text: "Umbrella is broken", // plain text body
      });
      console.log(umbrella);
      res.send(umbrella);
    } else if (!umbrella) {
      res.send("something wrong");
    }
  }
);

//addmin recieve noti broken
app.get("/recieve_noti", async (req, res) => {
  var send = "send";
  var inform = await Brokennoti.find({ noti_sst: send });
  if (inform) {
    console.log(inform);
    res.send(inform);
  } else if (!inform) {
    res.send("no notification");
  }
});

//admin read notifications
app.get("/read/:umbrella_id", async (req, res) => {
  var umbrella_id = req.params.umbrella_id;
  var read = "read";
  var umbrella = await Brokennoti.findOne({ rfid: umbrella_id });
  if (umbrella) {
    var query = { _id: umbrella._id };
    // await Umbrella.findOneAndUpdate(query, { noti_sst: read });
    await Brokennoti.findOneAndUpdate(query, { noti_sst: read });
    console.log(umbrella);
    res.send(umbrella);
  } else if (!umbrella) {
    res.send("something wrong");
  }
});

//edit password
app.post(
  "/change_pass/:user_id/:old_password/:new_password",
  async (req, res) => {
    var user_id = req.params.user_id;
    var old_password = req.params.old_password;
    var new_password = req.params.new_password;
    let user = await User.findOne({ p_id: user_id });
    let query = { _id: user._id };

    if (old_password == user.password) {
      await User.findOneAndUpdate(query, { password: new_password });
      console.log("changed password");
      res.send("changed password");
    } else if (old_password != user.password) {
      res.send("old password not correct");
    } else {
      res.send("something wrong");
    }
  }
);

//login
app.post("/login/:email/:password", async (req, res) => {
  var email = req.params.email;
  var password = req.params.password;
  let email_c = await User.findOne({ email: email });
  if (email_c) {
    // res.send("correct email");
    let password_c = await User.findOne({ email: email, password: password });
    if (password_c) {
      res.send(password_c);
      console.log(password_c);
    } else {
      res.send("incorrect password");
      console.log(password_c);
    }
  } else {
    res.send("incorrect email");
  }
});

//get user
app.post("/user/:user_id", async (req, res) => {
  var user_id = req.params.user_id;
  let user = await User.findOne({ p_id: user_id });
  if (user) {
    res.send(user);
  } else {
    res.send("incorrect user id");
  }
});

//get user
app.post("/user/:user_id", async (req, res) => {
  var user_id = req.params.user_id;
  let user = await User.findOne({ p_id: user_id });
  if (user) {
    res.send(user);
  } else {
    res.send("incorrect user id");
  }
});

//up status
app.get("/writestt/:id/:stt/:node_ip", async (req, res) => {
  let userid = req.params.id;
  let status = req.params.stt;
  let node_ip = req.params.node_ip;
  var addstatus = await new Status({
    userid: userid,
    status: status,
    place: node_ip,
  }).save();
  console.log(addstatus);
  res.send(addstatus);
});

//delete status
app.get("/getstt/:node_ip", async (req, res) => {
  // let userid = req.params.id;
  // let status = req.params.stt;
  let node_ip = req.params.node_ip;
  let user = await Status.findOne({ place: node_ip });
  // res.send(user);
  if (user) {
    console.log(user);
    res.send(
      user._id + "\n$$" + user.userid + "\n" + user.status + "\n" + user.place
    );
  }
  if (!user) {
    res.send("error");
  }
});

app.get("/delete_stt/:node_ip", async (req, res) => {
  // let userid = req.pearams.id;
  // let status = req.params.stt;
  let node_ip = req.params.node_ip;
  let user = await Status.findOne({ place: node_ip });
  // res.send(user);
  if (user) {
    console.log(user);
    await Status.findByIdAndDelete(user._id);
    res.send("blank");
  }
  if (!user) {
    res.send("error");
  }
});

//borrow umbrella
app.get(
  "/borrow/:user_id/:umbrella_id/:borrow_time/:borrow_place/:getting_time/:getting_place/:status",
  async (req, res) => {
    let user_id = req.params.user_id;
    let umbrella_id = req.params.umbrella_id;
    // let borrow_time = req.params.borrow_time;
    let borrow_time = Date.now();
    let borrow_place = req.params.borrow_place;
    let noti = await Place.findOne({ node_ip: borrow_place });
    let place_name = noti.place;
    let getting_time = req.params.getting_time;
    let getting_place = req.params.getting_place;
    let time = getting_time - borrow_time;
    let status = req.params.status;

    var getlocker = await Locker.findOne({ node_ip: borrow_place });
    var query = { _id: getlocker._id };
    if (getlocker.locker1 == "1") {
      await Locker.findOneAndUpdate(query, { locker1: "0" });
    } else if (getlocker.locker2 == "1") {
      await Locker.findOneAndUpdate(query, { locker2: "0" });
    } else if (getlocker.locker3 == "1") {
      await Locker.findOneAndUpdate(query, { locker3: "0" });
    } else if (getlocker.locker4 == "1") {
      await Locker.findOneAndUpdate(query, { locker4: "0" });
    } else if (getlocker.locker5 == "1") {
      await Locker.findOneAndUpdate(query, { locker5: "0" });
    }

    let borrow = await new Borrow({
      user_id: user_id,
      umbrella_id: umbrella_id,
      borrow_time: borrow_time,
      borrow_place: place_name,
      getting_time: getting_time,
      getting_place: getting_place,
      time: time,
      status: status,
    }).save();
    console.log("การยืมสำเร็จ");
    res.send("การยืมสำเร็จ");
  }
);

//send status to take photo
app.get("/send_to_app/:user_id", async (req, res) => {
  let user_id = req.params.user_id;
  let status = "borrowing";
  let noti = await Borrow.findOne({ user_id: user_id, status: status })
    .sort({ _id: -1 })
    .limit(10);
  if (noti) {
    console.log(noti);
    res.send(noti);
  } else {
    console.log("กำลังดำเนินการ");
    res.send("กำลังดำเนินการ");
  }
});

//checked umbrella_id
app.get("/umbrella/:node_ip/:umbrella_id/:request", async (req, res) => {
  let node_ip = req.params.node_ip;
  let umbrella_id = req.params.umbrella_id;
  let request = req.params.request;
  let umbrella = await Umbrella.findOne({ rfid: umbrella_id });
  // res.send(user);
  if (umbrella) {
    let realtime = await new Realtime({
      node_ip: node_ip,
      umbrella_id: umbrella_id,
      request: request,
    }).save();
    console.log(realtime);
    res.send(realtime);
  }
  if (!umbrella) {
    res.send("error");
  }
});

//get umbrella_id
app.get("/get_umbrella/:node", async (req, res) => {
  let node_ip = req.params.node;
  let umbrella = await Realtime.findOne({ node_ip: node_ip })
    .sort({ _id: -1 })
    .limit(10);
  if (umbrella) {
    res.send(
      "@node : " +
        node_ip +
        "\n#" +
        umbrella.umbrella_id +
        "\n%%" +
        umbrella.request
    );
  } else {
    res.send("error get umbrella id");
  }
  // let umbrella = await Realtime.find();
});

//get recently borrow
app.get("/recent_borrow/:user_id", async (req, res) => {
  let user_id = req.params.user_id;
  let stt = "borrowing";
  let recent = await Borrow.findOne({ user_id: user_id, status: stt })
    .sort({ _id: -1 })
    .limit(10);
  console.log(recent);
  res.send(recent);
});

//get recently borrow
app.get("/recent_deposit/:user_id", async (req, res) => {
  let user_id = req.params.user_id;
  let stt = "depositing";
  let recent = await Deposit.findOne({ user_id: user_id, status: stt })
    .sort({ _id: -1 })
    .limit(10);
  console.log(recent);
  res.send(recent);
});

// app.get('/get_umbrellaa', async (req, res) => {
//   // let node_ip = req.params.node_ip;
//   let umbrella = await Realtime.find();
//   res.send(umbrella);
//   // await Realtime.findByIdAndDelete(umbrella._id);
// });

//delete realtime
app.get("/delete_realtime/:node_ip", async (req, res) => {
  let node_ip = req.params.node_ip;
  let realtime = await Realtime.findOne({ node_ip: node_ip });
  // res.send(user);
  if (realtime) {
    console.log(realtime);
    await Realtime.findByIdAndDelete(realtime._id);
    res.send("blank");
  }
  if (!realtime) {
    res.send("error");
  }
});

//getting umbrella
app.get(
  "/getborrow/:user_id/:umbrella_id/:getting_time/:getting_place/:status",
  async (req, res) => {
    let user_id = req.params.user_id;
    let umbrella_id = req.params.umbrella_id;
    let borrow_data = await Borrow.findOne({
      user_id: user_id,
      umbrella_id: umbrella_id,
    })
      .sort({ _id: -1 })
      .limit(10);

    // res.send(user);
    if (borrow_data) {
      let query = { _id: borrow_data._id };
      // let getting_time = req.params.getting_time;
      let getting_time = Date.now();
      let getting_place = req.params.getting_place;
      let noti = await Place.findOne({ node_ip: getting_place });
      let place_name = noti.place;
      let time = getting_time - borrow_data.borrow_time;
      let status = req.params.status;

      var getlocker = await Locker.findOne({ node_ip: getting_place });
      var query1 = { _id: getlocker._id };
      if (getlocker.locker1 == "0") {
        await Locker.findOneAndUpdate(query1, { locker1: "1" });
      } else if (getlocker.locker2 == "0") {
        await Locker.findOneAndUpdate(query1, { locker2: "1" });
      } else if (getlocker.locker3 == "0") {
        await Locker.findOneAndUpdate(query1, { locker3: "1" });
      } else if (getlocker.locker4 == "0") {
        await Locker.findOneAndUpdate(query1, { locker4: "1" });
      } else if (getlocker.locker5 == "0") {
        await Locker.findOneAndUpdate(query1, { locker5: "1" });
      }

      await Borrow.findOneAndUpdate(query, {
        getting_time: getting_time,
        getting_place: place_name,
        time: time,
        status: status,
      });
      console.log("update success");
      res.send("update success");
    }
    if (!borrow_data) {
      res.send("update fail");
    }
  }
);

//show borrow history
app.get("/history/:type/:user_id", async (req, res) => {
  let user_id = req.params.user_id;
  let type = req.params.type;
  if (type == "borrow") {
    let borrow_history = await Borrow.find({ user_id: user_id });
    console.log(borrow_history);
    res.send(borrow_history);
  } else if (type == "deposit") {
    let deposit_history = await Deposit.find({ user_id: user_id });
    console.log(deposit_history);
    res.send(deposit_history);
  } else {
    res.send("can't find information");
  }
});

//show recent deposit place
app.get("/deposit_place/:user_id", async (req, res) => {
  let user_id = req.params.user_id;
  let borrow_history = await Deposit.findOne({ user_id: user_id })
    .sort({ _id: -1 })
    .limit(10);
  let place = borrow_history.deposit_place;
  let node_ip = await Place.findOne({ place: place });
  console.log(node_ip);
  res.send(node_ip);
});

//deposit umbrella
app.get(
  "/deposit/:user_id/:locker/:deposit_time/:deposit_place/:return_time/:return_place/:status",
  async (req, res) => {
    let user_id = req.params.user_id;
    let locker = req.params.locker;
    let deposit_time = Date.now();
    let deposit_place = req.params.deposit_place;
    let noti = await Place.findOne({ node_ip: deposit_place });
    let place_name = noti.place;
    let return_time = req.params.return_time;
    let return_place = req.params.return_place;
    let status = req.params.status;
    let time = return_time - deposit_time;

    var getlocker = await Locker.findOne({ node_ip: deposit_place });
    var query1 = { _id: getlocker._id };
    if (getlocker.locker6 == "0") {
      await Locker.findOneAndUpdate(query1, { locker6: user_id });
    } else if (getlocker.locker7 == "0") {
      await Locker.findOneAndUpdate(query1, { locker7: user_id });
    } else if (getlocker.locker8 == "0") {
      await Locker.findOneAndUpdate(query1, { locker8: user_id });
    }

    let deposit = await new Deposit({
      user_id: user_id,
      locker: locker,
      deposit_time: deposit_time,
      deposit_place: place_name,
      return_time: return_time,
      return_place: return_place,
      time: time,
      status: status,
    }).save();
    console.log(deposit);
    res.send(deposit);
  }
);

//return umbrella
app.get(
  "/getdeposit/:user_id/:locker/:return_time/:return_place/:status",
  async (req, res) => {
    let user_id = req.params.user_id;
    let locker = req.params.locker;
    let deposit_data = await Deposit.findOne({
      user_id: user_id,
      locker: locker,
    })
      .sort({ _id: -1 })
      .limit(10);
    // res.send(user);
    if (deposit_data) {
      let query = { _id: deposit_data._id };
      let return_time = Date.now();
      let return_place = req.params.return_place;
      let noti = await Place.findOne({ node_ip: return_place });
      let place_name = noti.place;
      let time = return_time - deposit_data.deposit_time;
      let status = req.params.status;

      var getlocker = await Locker.findOne({ node_ip: return_place });
      var query1 = { _id: getlocker._id };
      if (getlocker.locker6 == user_id) {
        await Locker.findOneAndUpdate(query1, { locker6: "0" });
      } else if (getlocker.locker7 == user_id) {
        await Locker.findOneAndUpdate(query1, { locker7: "0" });
      } else if (getlocker.locker8 == user_id) {
        await Locker.findOneAndUpdate(query1, { locker8: "0" });
      }

      await Deposit.findOneAndUpdate(query, {
        return_time: return_time,
        return_place: place_name,
        time: time,
        status: status,
      });

      console.log("update success");
      res.send("update success");
    }
    if (!deposit_data) {
      res.send("update fail");
    }
  }
);

//add locker
app.get(
  "/addlocker/:node_ip/:locker1/:locker2/:locker3/:locker4/:locker5/:locker6/:locker7/:locker8",
  async (req, res) => {
    var node_ip = req.params.node_ip;
    var locker1 = req.params.locker1;
    var locker2 = req.params.locker2;
    var locker3 = req.params.locker3;
    var locker4 = req.params.locker4;
    var locker5 = req.params.locker5;
    var locker6 = req.params.locker6;
    var locker7 = req.params.locker7;
    var locker8 = req.params.locker8;
    var addlocker = await new Locker({
      node_ip: node_ip,
      locker1: locker1,
      locker2: locker2,
      locker3: locker3,
      locker4: locker4,
      locker5: locker5,
      locker6: locker6,
      locker7: locker7,
      locker8: locker8,
    }).save();
    console.log(addlocker);
    res.send(addlocker);
  }
);

// //edit locker
// app.get("/addlocker/:node_ip/:locker1/:locker2/:locker3/:locker4/:locker5/:locker6/:locker7/:locker8", async (req, res) => {
//   var node_ip = req.params.node_ip;
//   var locker1 = req.params.locker1;
//   var locker2 = req.params.locker2;
//   var locker3 = req.params.locker3;
//   var locker4 = req.params.locker4;
//   var locker5 = req.params.locker5;
//   var locker6 = req.params.locker6;
//   var locker7 = req.params.locker7;
//   var locker8 = req.params.locker8;
//   var addlocker = await new Locker({node_ip:node_ip,locker1:locker1,locker2:locker2,locker3:locker3,locker4:locker4,locker5:locker5,locker6:locker6,locker7:locker7,locker8:locker8}).save()
//   console.log(addlocker);
//   res.send(addlocker);
// });

//get locker
app.get("/getlocker/:node_ip", async (req, res) => {
  var node_ip = req.params.node_ip;
  var getlocker = await Locker.findOne({ node_ip: node_ip });

  // console.log(getlocker.node_ip);
  // res.send(getlocker.node_ip);
  console.log(
    "$ip:" +
      getlocker.node_ip +
      "\nlocker1:" +
      getlocker.locker1 +
      "\nlocker2:" +
      getlocker.locker2 +
      "\nlocker3:" +
      getlocker.locker3 +
      "\nlocker4:" +
      getlocker.locker4 +
      "\nlocker5:" +
      getlocker.locker5 +
      "\nlocker6:" +
      getlocker.locker6 +
      "\nlocker7:" +
      getlocker.locker7 +
      "\nlocker8:" +
      getlocker.locker8
  );
  res.send(
    "$ip:" +
      getlocker.node_ip +
      "\nlocker1:" +
      getlocker.locker1 +
      "\nlocker2:" +
      getlocker.locker2 +
      "\nlocker3:" +
      getlocker.locker3 +
      "\nlocker4:" +
      getlocker.locker4 +
      "\nlocker5:" +
      getlocker.locker5 +
      "\nlocker6:" +
      getlocker.locker6 +
      "\nlocker7:" +
      getlocker.locker7 +
      "\nlocker8:" +
      getlocker.locker8
  );
});

//add picture
app.post("/picture/:user_id/:borrow_id/:status/:img", async (req, res) => {
  var user_id = req.params.user_id;
  var borrow_id = req.params.borrow_id;
  var status = req.params.status;
  var picture = req.params.img;
  // var name = Date.now()+".png";
  // // var a = req.body.a;
  // // res.send(a);
  // fs.writeFile('./picture/'+name, req.body.imgsource, 'base64', function(err) {
  //   res.send(req.body.imgsource);
  // })
  // res.status(200)
  if (status == "bb") {
    var addpicture = await new Picture({
      user_id: user_id,
      borrow_id: borrow_id,
      borrow_pic: picture,
    }).save();
    console.log(addpicture);
    res.send(addpicture);
  } else if (status == "bg") {
    var picture_update = await Picture.findOne({ borrow_id: borrow_id });
    var query = { _id: picture_update._id };
    await Picture.findOneAndUpdate(query, { getting_pic: picture });
    console.log("success");
    res.send("success");
  }
});

//test change time to date
app.get("/time/:time1", async (req, res) => {
  var time = req.params.time1;
  var day = new Date(Number(time)).toString();
  console.log(day);
  res.send(day);
});

//แจ้งเตือนยืมเกินเวลา
app.get("/timeover", async (req, res) => {
  var id = req.params.id;
  var status = "borrowing";
  var borrow = await Borrow.find({ status: status });
  // const countBorrow = await Borrow.countDocuments({status:status});

  for (let i = 0; i < borrow.length; i++){
    var borrow_time = borrow[i].borrow_time;
    var usr = borrow[i].user_id;
    var t = Number(borrow_time);
    var now = Date.now();
    var valid = (now - t) / (1000 * 60 * 60 * 24);
    var a = valid.toString();
    if(a>0.001){
      let query = {_id:borrow[i]._id};
      let stt_expire = "expire";
      await Borrow.findOneAndUpdate(query,{status:stt_expire});
      var user = await User.findOne({p_id:usr});
      var mail = user.email;
      let info = await transporter.sendMail({
        from: '"Umbrella Share KKU" <umbrellasharekku@gmail.com>', // อีเมลผู้ส่ง
        to: mail, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
        subject: 'expired borrrow status', // หัวข้ออีเมล
        text: 'Now umbrella id <<' + borrow[i].umbrella_id +'>> is expired' // plain text body
      });
      console.log(borrow[i]);
      res.send(borrow[i]);
    }
  }
});

//send expire notification
app.get("/noti/:user_id", async (req, res) => {
  let user_id = req.params.user_id;
  let stt_exp = "expire";
  let expire_br = await Borrow.find({ user_id: user_id, status: stt_exp });
  console.log(expire_br);
  res.send(expire_br);
});

//finished rotation status
app.get("/rotatestt/:node_ip", async (req, res) => {
  let nodeip = req.params.node_ip;
  // let status = "rotating";
  var addstatus = await Rotation.findOne({ nodeip: nodeip });
  // console.log(addstatus);
  // res.send(addstatus);
  if (addstatus) {
    console.log(addstatus);
    res.send(addstatus._id + "\n" + addstatus.status);
  }
  if (!addstatus) {
    res.send("error");
  }
});

//edit rotation status
app.get("/edit_rotationstt/:node_ip/:stt", async (req, res) => {
  let nodeip = req.params.node_ip;
  let status = req.params.stt;
  var rotation = await Rotation.findOne({ nodeip: nodeip });
  if (rotation) {
    var query = { _id: rotation._id };
    await Rotation.findOneAndUpdate(query, { status: status });
    console.log(rotation);
    res.send(rotation);
  } else if (!rotation) {
    res.send("something wrong");
  }
});

//add rotation
app.get("/add_rotation/:node_ip", async (req, res) => {
  let nodeip = req.params.node_ip;
  let status = "stop";
  var addstatus = await new Rotation({ nodeip: nodeip, status: status }).save();
  console.log(addstatus);
  res.send(addstatus);
  // if(addstatus){
  //   console.log(addstatus);
  // }
  // if(!addstatus){
  //   res.send("error");
  // }
});

//count locker
app.get("/count_locker/:mac_address/:status", async (req, res) => {
  let mac_address = req.params.mac_address;
  let status = req.params.status;
  var count_available = 0;
  let locker = await Locker.findOne({ node_ip: mac_address });
  if(status == "borrow"){
    const available = [];
    available[0] = locker.locker1;
    available[1] = locker.locker2;
    available[2] = locker.locker3;
    available[3] = locker.locker4;
    available[4] = locker.locker5;
    for(let i=0; i<5; i++){
      if(available[i] == 0){
        count_available++;
      }
    }
    console.log(count_available);
    res.send(count_available);
  }
});