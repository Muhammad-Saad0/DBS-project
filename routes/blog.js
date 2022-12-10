const express = require("express");

const db = require("../Database/Database");

const router = express.Router();

router.get("/", async function(req, res){ 
    // db.query("Whatever query")  
    res.redirect("/posts");
});

router.get("/posts",async function(req, res){
    res.render("posts-list");
});

router.get("/new-post",function(req, res){
    res.render("create-post");
})

module.exports = router;