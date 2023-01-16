const backDropElement = document.getElementById("backdrop")
const forgotPasswordContainer = document.getElementById("forgot-password-container")
const forgotPasswordUsername = document.getElementById("forgotpass-username")
const forgotPasswordUsername2 = document.getElementById("forgotpass-username2")
const validEmail = document.getElementById("valid-email")
const oldPassword = document.getElementById("old-password")
const forgotPasswordForm = document.getElementById("old-pass-form")
const forgotPassSubmitBtn = document.getElementById("forgotpass-submit-btn")
const statusElement = document.getElementById("show-status")
const statusElement2 = document.getElementById("show-status2")
const forgotPasswordContainer2 = document.getElementById("forgot-password-container2")

function randomString() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

function openContainer2(){
    event.preventDefault()
    forgotPasswordContainer.style.display = "none"
    forgotPasswordContainer2.style.display = "block"
}

function openContainer(){
    event.preventDefault()
    backDropElement.style.display = "block"
    forgotPasswordContainer.style.display = "block"
}

function closeContainer(){
    event.preventDefault()
    backDropElement.style.display = "none"
    forgotPasswordContainer.style.display = "none"
    forgotPasswordContainer2.style.display = "none"
    statusElement.textContent = ""
    statusElement2.textContent = ""
}

async function form2Submitted(){
    event.preventDefault()

    data = {
        username: forgotPasswordUsername2.value,
        validEmail: validEmail.value
    }
    let response =await fetch(`/check-username`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })
    response = await response.json()
    if(response.message == 0){
        statusElement2.textContent = "No such user exists"
        forgotPasswordUsername2.value = ""
        validEmail.value = ""
        return
    }
    data.uniqueString = randomString()
    response =await fetch(`/send-verification-mail`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })
    
}

async function formSubmitted(){
    statusElement.textContent = ""
    event.preventDefault()

    data = {
        username: forgotPasswordUsername.value,
        oldPassword: oldPassword.value
    }
    let response =await fetch(`/check-username`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })
    response = await response.json()
    if(response.message == 0){
        statusElement.textContent = "No such user exists"
        forgotPasswordUsername.value = ""
        oldPassword.value = ""
        return
    }
    else if(response.message == 1){
    let response =await fetch(`/check-old-password`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data)
        })
        response = await response.json()
        console.log(response)
        if(response.message == 1){
            fetch(`/update-forgotten-password`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(data)
            })
            statusElement.textContent = "Password updated to old password you entered"
        }
        else{
            statusElement.textContent = "didn't match any old passwords"
        }
    }
}


  
