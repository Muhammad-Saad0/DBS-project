const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const alert = require("alert");
const bcrypt = require("bcryptjs")
const Multer = require("multer");

const db = require("../Database/Database");
const {isEmailValid} = require("../Utilities/Email")

const router = express.Router();

//we creating this to configure multer storage options
const storageConfig = Multer.diskStorage({
    //cb is the callback function
    destination: function (req, file, cb) {
      cb(null, "public/images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  // in braces we tell multer where and how to store the file
  const multer = Multer({ storage: storageConfig });

router.get("/", async function(req, res){ 
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

//-------------------------------------------------------------------//
router.get("/post-list", async function(req, res){
    const [result] = await db.query(`select P.POST_ID, P.POST_DESCRIPTION,
    P.USER_ID, P.TITLE,P.DATE,pp.image_url,l.users_id as LIKED_BY,U.USERNAME,
    D.PROFILE_PIC from posts as p
    left outer join photographic_posts as pp
    on p.post_id = pp.posts_id
    left outer join likes as l
    on l.posts_id = p.post_id
    inner join user as U on U.USER_ID = P.USER_ID
    inner join user_details as D on D.USER_ID = P.USER_ID`)
    res.render("post-list", {posts: result,
    loggedInUserId: req.session.user.id});
})

router.get("/user-details/:id", async function(req, res){
    const userId = req.params.id
    const [result] = await db.query(`Select U.USER_ID, U.EMAIL, U.USERNAME,
     U.GENDER, D.PROFILE_PIC, D.ABOUT, D.CITY, COUNT(F.FOLLOWING_ID) AS FOLLOWING
    from user as U inner join user_details AS D on U.USER_ID = D.USER_ID 
    LEFT JOIN FOLLOWS AS F ON U.USER_ID = F.USER_ID 
    WHERE U.USER_ID = ${userId}`)

    let followers = await db.query(`SELECT COUNT(FOLLOWER_ID) AS FOLLOWERS FROM followed_by WHERE USER_ID = ${userId}`)
    followers = followers[0]
    followers = followers[0]
    result[0].FOLLOWERS = followers.FOLLOWERS
    res.json(result)
})

router.get("/show-comments/:id", async function(req, res){
    const postId = req.params.id
    const result = await db.query(`select C.TEXT, C.DATE, U.USERNAME, U.USER_ID, D.PROFILE_PIC FROM COMMENTS AS C 
    INNER JOIN USER AS U ON C.USER_ID = U.USER_ID LEFT JOIN user_details AS D ON C.USER_ID = D.USER_ID WHERE C.POST_ID =${postId}`)
    res.json(result)
})

router.get("/validate-user/:id", async function(req, res){
    if(req.session.user.id == req.params.id){
        res.json(true)
    }
    else
    res.json(false)
})

router.get("/follow-user/:id", async function(req, res){
    const userId = req.session.user.id
    const toFollow = req.params.id
    await db.query(`INSERT INTO FOLLOWS VALUES(${userId}, ${toFollow})`)
    res.json()
})

router.get("/unfollow-user/:id", async function(req, res){
    const userId = req.session.user.id
    const toUnFollow = req.params.id
    await db.query(`DELETE FROM follows WHERE USER_ID = ${userId} and FOLLOWING_ID = ${toUnFollow}`)
    res.json()
})

router.get("/edit-user-details/:id", async function(req, res){
    let user = await db.query(`SELECT * FROM user AS U INNER JOIN user_details AS D ON
    U.USER_ID = D.USER_ID WHERE U.USER_ID = ${req.params.id}`)
    user = user[0]
    res.render(`edit-user-details`, {user: user[0]})
})

router.get("/follow-check/:id", async function(req, res){
    let response = await db.query(`SELECT * FROM FOLLOWS WHERE USER_ID = ${req.session.user.id} and FOLLOWING_ID = ${req.params.id}`)
    response = response[0]
    res.json(response)
})

router.get("/count-followers/:id", async function(req, res){
    const userId = req.params.id
    console.log(userId)
    let followers = await db.query(`SELECT count(*) AS FOLLOWERS FROM followed_by WHERE USER_ID = ${userId}`)
    res.json(followers)
})

router.post("/edit-user-details", multer.single("user-image"), async function(req, res){
    const dataFromForm = req.body
    if(!req.file){
        await db.query(`update user_details set PHONE = "${dataFromForm.phone}", ABOUT =  "${dataFromForm.about}",
        STREET = "${dataFromForm.street}", CITY = "${dataFromForm.city}", ZIP =  "${dataFromForm.zip}"
        where USER_ID = ${req.session.user.id}`)
        return res.redirect(`/edit-user-details/${req.session.user.id}`)
    }
    else{
        console.log(req.file.filename)
        const uploadedImage = req.file.filename
        const uploadedImagePath = "images//" + uploadedImage
        await db.query(`update user_details set PHONE = "${dataFromForm.phone}", ABOUT =  "${dataFromForm.about}",
        STREET = "${dataFromForm.street}", CITY = "${dataFromForm.city}", ZIP =  "${dataFromForm.zip}",
        PROFILE_PIC = "${uploadedImagePath}" where USER_ID = ${req.session.user.id}`)
        return res.redirect(`/edit-user-details/${req.session.user.id}`)
    }
 })

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
    let response = await db.query(`CALL check_password("${formData.name}", "${formData.password}")`)
    response = response[0]
    response = response[0]
    console.log(response[0].message)

    if(response[0].message == 0){
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
    const data = [
      dataFromForm.email,
      dataFromForm.name,
      dataFromForm.password,
      dataFromForm.gender,
    ];

    let email = (dataFromForm.email).trim()
    email = email.toLowerCase()
    const valid = await isEmailValid(email);
    if(!valid){
        req.flash("email_error",'I')
        return res.redirect("/")
    };
    let [result] = await db.query("select * from user where USERNAME=\"" +
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

  router.post("/add-post", multer.single("image"), async function(req, res){
    const uploadedImage = req.file.filename;
    const postData = req.body;

    const data = [
        postData.title,
        postData.content,
        req.session.user.id
    ];
    await db.query(
        "insert into posts (TITLE, POST_DESCRIPTION, USER_ID) values (?)",
        [data]
        );

    if(uploadedImage){
        const [result] = await db.query(
            `select post_id
            from posts
            where user_id = 2
            order by DATE DESC
            limit 1`
            );

            const uploadedImagePath = "images//" + uploadedImage
            const latestPostId = result[0].post_id
            const data2 = [
                latestPostId,
                uploadedImagePath
            ]

            await db.query(
                "insert into photographic_posts (POSTS_ID, IMAGE_URL) values (?)",
                [data2]
            )
        }
            res.redirect("/new-post");
        });

    router.post("/likes/:id", async function(req, res){
        const postId = req.params.id
        const userId = req.session.user.id
        const data = [
            postId,
            userId
        ]

        const [result] = await db.query("select * from likes where USERS_ID=" 
        + userId + " and POSTS_ID=" + postId)

        if(result.length == 0){
            await db.query("insert into likes (POSTS_ID, USERS_ID) values (?)",
            [data])
        }
        else{
            await db.query("delete from likes where USERS_ID=" 
            + userId + " and POSTS_ID=" + postId)
        }
        return 
    })

    router.post("/comments/:id", async function(req, res){
        const postId = req.params.id
        const userId = req.session.user.id
        const commentText = req.body.text

        console.log(req.body)
        const data = [
            postId,
            userId,
            commentText
        ]

        const result = await db.query(`insert into comments (POST_ID, USER_ID, TEXT) values (?)`,
        [data])
        res.json({message: "comment added succesfully"})
    })

module.exports = router;