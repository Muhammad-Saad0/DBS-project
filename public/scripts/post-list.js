

const toggleBtns = document.getElementsByClassName("fa fa-heart")
const commentForms = document.getElementsByClassName("comment-form")
const viewCommentsElements = document.getElementsByClassName("view-comments-btn")
const backDropElement = document.getElementById("backdrop")
const commentPopUpElement = document.getElementById("comment-popup")
const userDetailsContainer = document.getElementById("profile-card")
const userDetailsBtns = document.getElementsByClassName("user-details-btns")

$(document).ready(function(){
  $('.menu-close').hide();

  $('.menu').click(function(){
      $('.menu-panel').toggleClass('show');
      $('.menu-background').toggleClass('show');
      $('.menu').hide();
      $('.menu-close').show();
  });
  $('.menu-close').click(function(){
      $('.menu-panel').removeClass('show');
      $('.menu-background').removeClass('show');
      $('.menu').show();
      $('.menu-close').hide();
  });
});

function btnToggle(event){
    const btn = event.target
    const postId = btn.dataset.postid
    if(btn.classList.contains("text-danger")){
        btn.classList.remove("text-danger")
    }
    else{
        btn.classList.add("text-danger")
    } 

    fetch(`/likes/${postId}`,{
        method: "POST",
    })
}

function createCommentsList(comments) {
    const commentList = document.createElement("ul");
  
    for (const comment of comments) {
      const commentElement = document.createElement("li");
      commentDate = new Date(comment.DATE).toUTCString()
      console.log(comment)
      commentElement.innerHTML = `
      <div class="d-flex flex-column comment-box2" id="comment-container">
      <div class="bg-white">
        <div class="flex-row d-flex">
          <img src="${comment.PROFILE_PIC}" width="40" class="rounded-circle">
          <div class="d-flex flex-column justify-content-start ml-2">
            <a href="" class="d-block font-weight-bold name" onclick="openUserDetails(${comment.USER_ID})">${comment.USERNAME}</a>
            <span class="date text-black-50">${commentDate}</span>
          </div>
        </div>
        <div class="mt-3">
          <p class="comment-text">${comment.TEXT}</p>
        </div>
      </div>
    </div>
      `;
      commentList.appendChild(commentElement);
    }
  
    return commentList;
  }

  function createUserDetailsContainer(user, validate, followCheck){
    const container = document.createElement("div")
    let onclick=`followUser(${user.USER_ID})`;
    let buttonText = "Follow"
    let href = "";
    let status = "notfollowed"
    if(followCheck){
      status = "followed"
      buttonText = "UnFollow"
    }
    if(validate){
      onclick=``
      buttonText = "Edit Profile"
      href = `/edit-user-details/${user.USER_ID}`
    }
    if(user.PROFILE_PIC){
      container.innerHTML = `<div class="row py-5 px-4" id="profile-card">
    <div class="col-md-5 mx-auto"> <!-- Profile widget -->
        <div class="bg-white shadow rounded overflow-hidden"> 
           <div class="px-4 pt-0 pb-4 cover">
                <div class="media align-items-end profile-head"> 
                   <div class="profile mr-3"><img src="${user.PROFILE_PIC}" alt="..." width="130" class="rounded mb-2 img-thumbnail">
                       <a href="${href}" id="follow-btn" class="btn btn-outline-dark btn-sm btn-block" data-status="${status}" onclick="${onclick}">${buttonText}</a>
                   </div> 
                   <div class="media-body mb-5 text-white"> 
                       <h4 class="mt-0 mb-0">${user.USERNAME}</h4> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>${user.CITY}</p> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>${user.GENDER}</p>
                   </div> </div>
                </div> <div class="bg-light p-4 d-flex justify-content-end text-center"> 
                   <ul class="list-inline mb-0"> 
                       <li class="list-inline-item">
                            <h5 class="font-weight-bold mb-0 d-block show-followers">${user.FOLLOWERS}</h5>
                               <small class="text-muted"> <i class="fas fa-user mr-1"></i>Followers</small> </li>
                                <li class="list-inline-item"> <h5 class="font-weight-bold mb-0 d-block">${user.FOLLOWING}</h5>
                                   <small class="text-muted"> <i class="fas fa-user mr-1"></i>Following</small> 
                               </li> 
                           </ul>
                        </div> 
                        <div class="px-4 py-3"> 
                           <h5 class="mb-0">About</h5>
                            <div class="p-4 rounded shadow-sm bg-light"> 
                              <p class="font-italic mb-0">${user.ABOUT}</p>
                               </div> 
                               <a href="" class="btn btn-outline-dark btn-sm btn-block" onclick="closeBackDrop()">Close</a>
                           </div> 
                       </div> 
                   </div>
               </div>`
            }
            else{
              container.innerHTML = `<div class="row py-5 px-4" id="profile-card">
      <div class="col-md-5 mx-auto"> <!-- Profile widget -->
        <div class="bg-white shadow rounded overflow-hidden"> 
           <div class="px-4 pt-0 pb-4 cover">
                <div class="media align-items-end profile-head"> 
                   <div class="profile mr-3"><img src="/images/default-user-icon.png" alt="..." width="130" class="rounded mb-2 img-thumbnail">
                   <button href="${href}" id="follow-btn" class="btn btn-outline-dark btn-sm btn-block" data-status="${status}" onclick="${onclick}">${buttonText}</button>
                   </div> 
                   <div class="media-body mb-5 text-white"> 
                       <h4 class="mt-0 mb-0">${user.USERNAME}</h4> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>${user.CITY}</p> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>${user.GENDER}</p>
                   </div> </div>
                </div> <div class="bg-light p-4 d-flex justify-content-end text-center"> 
                   <ul class="list-inline mb-0"> 
                       <li class="list-inline-item">
                       <h5 class="font-weight-bold mb-0 d-block show-followers">${user.FOLLOWERS}</h5>
                               <small class="text-muted"> <i class="fas fa-user mr-1"></i>Followers</small> </li>
                                <li class="list-inline-item"> <h5 class="font-weight-bold mb-0 d-block">${user.FOLLOWING}</h5>
                                   <small class="text-muted"> <i class="fas fa-user mr-1"></i>Following</small> 
                               </li> 
                           </ul>
                        </div> 
                        <div class="px-4 py-3"> 
                           <h5 class="mb-0">About</h5>
                            <div class="p-4 rounded shadow-sm bg-light"> 
                               <p class="font-italic mb-0">${user.ABOUT}</p> 
                               </div> 
                               <a href="" class="btn btn-outline-dark btn-sm btn-block" onclick="closeBackDrop()">Close</a>
                           </div> 
                       </div> 
                   </div>
               </div>`
            }
      return container
  }

  //-----------------------------------------------------//
  async function openUserDetails(val){
    event.preventDefault()
    let validate = await fetch(`/validate-user/${val}`)
    validate =await (validate.json())
    let response = await fetch(`/user-details/${val}`)
    response = await response.json()
    response = response[0]
    let followCheck = await fetch(`/follow-check/${val}`)
    followCheck = await followCheck.json()

    const userDetails = createUserDetailsContainer(response, validate, followCheck[0])
    userDetailsContainer.innerHTML = ""
    userDetailsContainer.appendChild(userDetails)
    userDetailsContainer.style.display = "block"
    commentPopUpElement.style.display = "none"
    backDropElement.style.display = "block"
  }

  async function editUserDetails(val){
    event.preventDefault()
    await fetch(`/edit-user-details/${val}`)
  }

  function addComment(event){
    event.preventDefault()
    console.log("add comment called")
    const form = event.target
    const postId = form.dataset.postid
    const inputField = document.getElementById(`comment-input-field${postId}`)
    const commentText = inputField.value;
    console.log(commentText)
    
    const comment = { text: commentText }

    console.log(JSON.stringify(comment))

    fetch(`/comments/${postId}`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(comment)
    })
    inputField.value = ""
  }

async function followUser(val){
  event.preventDefault()
  const btn = document.getElementById("follow-btn")
  const followersElements = document.getElementsByClassName("show-followers")
  const status = btn.dataset.status
  if(status == "notfollowed"){
    btn.dataset.status = "followed"
    btn.textContent = "UnFollow"
    await fetch(`/follow-user/${val}`)
  }
  else if(status == "followed"){
    btn.dataset.status = "notfollowed"
    btn.textContent = "Follow"
    await fetch(`/unfollow-user/${val}`)
  }
  let resfollowers = await fetch(`/count-followers/${val}`)
  resfollowers = await resfollowers.json()
  resfollowers = resfollowers[0]
  console.log(resfollowers[0].FOLLOWERS)
  for(const followersElement of followersElements){
    followersElement.textContent =await resfollowers[0].FOLLOWERS
  }
}

function closeBackDrop(){
    event.preventDefault()
    backDropElement.style.display = "none"
    commentPopUpElement.style.display = "none"
    userDetailsContainer.style.display = "none"
}

async function showComments(event){

    backDropElement.style.display = "block"
    const btn = event.target
    const postId = btn.dataset.postid
    let result = await fetch(`/show-comments/${postId}`)
    result = await result.json()
    result = result[0]
    const commentList = createCommentsList(result)

    commentPopUpElement.innerHTML = ""
    commentPopUpElement.appendChild(commentList)
    commentPopUpElement.style.display = "block"
}

function userDetailsBtnPressed(event){
    event.preventDefault()
    const btn = event.target;
    const userid = btn.dataset.userid
    openUserDetails(userid)
}

for(const btn of toggleBtns){
    btn.addEventListener("click", btnToggle, false)
}

for(const form of commentForms){
    form.addEventListener("submit", addComment, false)
}

for(const viewCommentsElement of viewCommentsElements){
    viewCommentsElement.addEventListener("click", showComments, false)
}

for(const btn of userDetailsBtns){
  btn.addEventListener("click", userDetailsBtnPressed, false)
}

backDropElement.addEventListener("click", closeBackDrop, false)