// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

val = [];
var initialCount, defectsCount;
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//MongoDB connection declaration
let dbConn = process.env.DATABSE_URI;
if(dbConn==null || dbConn=="") {
  dbConn="mongodb+srv://admin-gowtham:Sleep123@defecttracking-xevxp.mongodb.net/DefectTrackingDB?retryWrites=true&w=majority";
}
const mongoose = require("mongoose");
mongoose.connect(dbConn, {
  useNewUrlParser: true
}).catch(function(error) {
  console.error(error);
});

//DB Schema
const defectSchema = new mongoose.Schema({
  reportType: String,
  firstName: String,
  lastName: String,
  email: String,
  date: Date,
  selectComp: String,
  isOther: String,
  notes: String,
  replaced: String,
  replacedBy: String
});

//DB Model instance
const Defect = mongoose.model("Defect", defectSchema);

//Default root
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

//Adding data Doc to the DB
app.post("/", function(req, res) {
  if (req.body.selComp != "Other") {
    req.body.other = "NA";
  }
  if (req.body.replComp == "no") {
    req.body.whoReplcd = "Not Replaced";
  }

  val = [
    req.body.reportType, req.body.fnm, req.body.lnm,
    req.body.Email, req.body.date, req.body.selComp,
    req.body.other, req.body.info, req.body.replComp,
    req.body.whoReplcd
  ];
  console.log(val[0]);

  const defect = new Defect({
    reportType: val[0],
    firstName: val[1],
    lastName: val[2],
    email: val[3],
    date: val[4],
    selectComp: val[5],
    isOther: val[6],
    notes: val[7],
    replaced: val[8],
    replacedBy: val[9]
  });

  // Catching issue when saving the record
  try {
    defect.save(function(err, product) {
      if (err) {
        throw (err);
      } else {
        console.log(product);
        res.redirect("/success");
      }
    });
  } catch (err) {
    res.render("failure", {
      failNote: val[7]
    });
  }
});

//Route for Failure
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//Route for Success
app.get("/success", function(req, res) {
  mongoose.connection.close();
  res.sendFile(__dirname + "/success.html");
});

//Port declaration for app listening
let port = process.env.PORT;
if(port==null || port=="") {
  port=3330;
}

app.listen(port, function() {
  console.log("Server connected successfully");
});
