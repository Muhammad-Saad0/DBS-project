
const toggleBtns = document.getElementsByClassName("fa fa-heart")
const commentForms = document.getElementsByClassName("comment-form")
const viewCommentsElements = document.getElementsByClassName("view-comments-btn")
const backDropElement = document.getElementById("backdrop")
const commentPopUpElement = document.getElementById("comment-popup")
const userDetailsContainer = document.getElementById("profile-card")
const userDetailsBtns = document.getElementsByClassName("user-details-btns")

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

  function createUserDetailsContainer(user){
    const container = document.createElement("div")
    if(user.PROFILE_PIC){
      container.innerHTML = `<div class="row py-5 px-4" id="profile-card">
    <div class="col-md-5 mx-auto"> <!-- Profile widget -->
        <div class="bg-white shadow rounded overflow-hidden"> 
           <div class="px-4 pt-0 pb-4 cover">
                <div class="media align-items-end profile-head"> 
                   <div class="profile mr-3"><img src="${user.PROFILE_PIC}" alt="..." width="130" class="rounded mb-2 img-thumbnail">
                       <a href="#" class="btn btn-outline-dark btn-sm btn-block">Follow</a>
                   </div> 
                   <div class="media-body mb-5 text-white"> 
                       <h4 class="mt-0 mb-0">${user.USERNAME}</h4> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>New York</p> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>${user.GENDER}</p>
                   </div> </div>
                </div> <div class="bg-light p-4 d-flex justify-content-end text-center"> 
                   <ul class="list-inline mb-0"> 
                       <li class="list-inline-item">
                            <h5 class="font-weight-bold mb-0 d-block">215</h5>
                               <small class="text-muted"> <i class="fas fa-user mr-1"></i>Followers</small> </li>
                                <li class="list-inline-item"> <h5 class="font-weight-bold mb-0 d-block">340</h5>
                                   <small class="text-muted"> <i class="fas fa-user mr-1"></i>Following</small> 
                               </li> 
                           </ul>
                        </div> 
                        <div class="px-4 py-3"> 
                           <h5 class="mb-0">About</h5>
                            <div class="p-4 rounded shadow-sm bg-light"> 
                               <p class="font-italic mb-0">Web Developer</p> 
                               <p class="font-italic mb-0">Lives in New York</p>
                                <p class="font-italic mb-0">Photographer</p> 
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
                       <a href="#" class="btn btn-outline-dark btn-sm btn-block">Follow</a>
                   </div> 
                   <div class="media-body mb-5 text-white"> 
                       <h4 class="mt-0 mb-0">${user.USERNAME}</h4> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>New York</p> 
                       <p class="small mb-4"> <i class="fas fa-map-marker-alt mr-2"></i>${user.GENDER}</p>
                   </div> </div>
                </div> <div class="bg-light p-4 d-flex justify-content-end text-center"> 
                   <ul class="list-inline mb-0"> 
                       <li class="list-inline-item">
                            <h5 class="font-weight-bold mb-0 d-block">215</h5>
                               <small class="text-muted"> <i class="fas fa-user mr-1"></i>Followers</small> </li>
                                <li class="list-inline-item"> <h5 class="font-weight-bold mb-0 d-block">340</h5>
                                   <small class="text-muted"> <i class="fas fa-user mr-1"></i>Following</small> 
                               </li> 
                           </ul>
                        </div> 
                        <div class="px-4 py-3"> 
                           <h5 class="mb-0">About</h5>
                            <div class="p-4 rounded shadow-sm bg-light"> 
                               <p class="font-italic mb-0">Web Developer</p> 
                               <p class="font-italic mb-0">Lives in New York</p>
                                <p class="font-italic mb-0">Photographer</p> 
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
    console.log(val)
    console.log("helllllloooo")
    let response = await fetch(`/user-details/${val}`)
    response = await response.json()
    response = response[0]

    const userDetails = createUserDetailsContainer(response)
    console.log(userDetails)
    userDetailsContainer.innerHTML = ""
    userDetailsContainer.appendChild(userDetails)
    userDetailsContainer.style.display = "block"
    commentPopUpElement.style.display = "none"
    backDropElement.style.display = "block"
  }

function addComment(event){
    event.preventDefault()
    console.log("add comment called")
    const form = event.target
    const postId = form.dataset.postid
    const inputField = document.getElementById(`comment-input-field${postId}`)
    const commentText = inputField.value;
    
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
    console.log("hello")
    viewCommentsElement.addEventListener("click", showComments, false)
}

for(const btn of userDetailsBtns){
  btn.addEventListener("click", userDetailsBtnPressed, false)
}

backDropElement.addEventListener("click", closeBackDrop, false)