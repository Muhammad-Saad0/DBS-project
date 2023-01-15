const backDropElement = document.getElementById("backdrop")
const changePassForm = document.getElementById("change-password-form")
const currentPasswordField = document.getElementById("current-password")
const newPasswordField = document.getElementById("new-password")
const closeBtn = document.getElementById("close-btn")
const changePasswordContainer = document.getElementById("change-password-container")

async function changePassword(){
    event.preventDefault()
    const currentPassword = currentPasswordField.value
    const newPassword = newPasswordField.value

    console.log(currentPassword)
    data = {
        currentPassword: currentPassword,
        newPassword: newPassword
    }

    let response = await fetch(`/check-current-password`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })
    response = await response.json()
    if(response.message == 0){
        const showError = document.getElementById("show-error")
        showError.textContent = "Current password is incorrect"
        currentPasswordField.value = ""
        newPasswordField.value = ""
        return
    }

    fetch(`/update-password`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })
    const showError = document.getElementById("show-error")
    showError.textContent = "Password Updated"
    currentPasswordField.value = ""
    newPasswordField.value = ""
}

function openChangePassForm(){
    event.preventDefault()
    changePasswordContainer.style.display = "block"
    backDropElement.style.display = "block"
}

function closeChangePassword(){
    event.preventDefault()
    backDropElement.style.display = "none"
    changePasswordContainer.style.display = "none"
}

changePassForm.addEventListener("submit", changePassword, false)
closeBtn.addEventListener("click", closeChangePassword, false)