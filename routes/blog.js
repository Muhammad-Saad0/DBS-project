const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const alert = require("alert");
const bcrypt = require("bcryptjs")

const db = require("../Database/Database");
const {isEmailValid} = require("../Utilities/Email")

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
    if(!req.session.user){
        return res.status(404).render("404")
    }
    res.render("create-post");
});

router.get("/login-user",function(req, res){
    const error_status= req.flash("error_status")
    res.render("user-login", {error_status:error_status});
});

router.post("/logout", function(req, res){
    req.session.user = null;
    return res.redirect("/login-user");
});

router.post("/login-user",async function(req, res){
    const formData=req.body;
    const data = [
        formData.name,
        formData.password,
      ];
      const [result] = await db.query("select * from user where USERNAME=\"" +
    formData.name+"\"");
    if(result.length===0){
        console.log("check 1")
        req.flash("error_status", "U");
        return res.redirect("/login-user");
    }

    if(!await bcrypt.compare(formData.password, result[0].PASSWORD)){
        console.log("check 2")
        req.flash("error_status", "P");
        return res.redirect("/login-user");
    }
    //just creating a variable for convenience
    let existingUser = result[0]
    req.session.user = {
        id: existingUser.USER_ID,
        email: existingUser.EMAIL
    }
    req.session.save(function(){
        return res.redirect("/new-post");
    })
});

router.post("/signup-user", async function (req, res) {
    const dataFromForm = req.body;
    const hashedPassword = await bcrypt.hash(dataFromForm.password, 12);
    const data = [
      dataFromForm.email,
      dataFromForm.name,
      hashedPassword,
      dataFromForm.gender,
    ];

    let email = (dataFromForm.email).trim()
    email = email.toLowerCase()
    const {valid, reason, validators} = await isEmailValid(email);
    if(!valid){
        req.flash("email_error",'I')
        return res.redirect("/")
    };

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
        return res.redirect("/")
    }

    await db.query(
        "insert into user (EMAIL, USERNAME, PASSWORD, GENDER) values (?)",
        [data]
        );
        alert("SUCCESSFULLY REGISTERED")
        res.redirect("/posts");
  });

module.exports = router;