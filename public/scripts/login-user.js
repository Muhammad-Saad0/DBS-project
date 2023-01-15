const backDropElement = document.getElementById("backdrop")
const forgotPasswordContainer = document.getElementById("forgot-password-container")
const forgotPasswordUsername = document.getElementById("forgotpass-username")
const oldPassword = document.getElementById("old-password")
const forgotPasswordForm = document.getElementById("old-pass-form")
const forgotPassSubmitBtn = document.getElementById("forgotpass-submit-btn")
const statusElement = document.getElementById("show-status")

function openContainer(){
    event.preventDefault()
    backDropElement.style.display = "block"
    forgotPasswordContainer.style.display = "block"
}

function closeContainer(){
    event.preventDefault()
    backDropElement.style.display = "none"
    forgotPasswordContainer.style.display = "none"
}

async function formSubmitted(){
    statusElement.textContent = ""
    event.preventDefault()

    data = {
        username: forgotPasswordUsername.value,
        oldPassword: oldPassword.value
    }
    console.log(data.oldPassword)
    let response =await fetch(`/check-username`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })
    response = await response.json()
    console.log(response)
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
