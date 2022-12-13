const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const alert = require("alert");

const db = require("../Database/Database");

const router = express.Router();

router.get("/", async function(req, res){ 
    // db.query("Whatever query")
    const user_error= req.flash("user_error")
    const email_error= req.flash("email_error") 
    res.render("user-signup", {email_error:email_error,
        user_error:user_error});
});

router.get("/posts",async function(req, res){
    res.render("posts-list");
});

router.get("/new-post",function(req, res){
    res.render("create-post");
});

router.post("/signup-user", async function (req, res) {
    const dataFromForm = req.body;
    const data = [
      dataFromForm.email,
      dataFromForm.name,
      dataFromForm.password,
      dataFromForm.gender,
    ];
     [result] = await db.query("select * from user where USERNAME=\"" +
    dataFromForm.name+"\"");
     if(result.length !=0){
         req.flash("user_error",'U')
         res.redirect("/")
         return;
     } 

    [result] = await db.query("select * from user where EMAIL=\"" +
    dataFromForm.email+"\"");
    if(result.length != 0){
        req.flash("email_error",'E')
        res.redirect("/")
        return;
    }
    await db.query(
        "insert into user (EMAIL, USERNAME, PASSWORD, GENDER) values (?)",
        [data]
        );
        alert("SUCCESSFULLY REGISTERED")
        res.redirect("/posts");
  });

module.exports = router;