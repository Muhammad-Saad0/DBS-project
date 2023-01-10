const filePickerElement = document.getElementById('image')
const imagePreviewElement = document.getElementById("image-preview")
const imagePickerContainer = document.getElementById("image-picker-container")

filePickerElement.addEventListener('change', imagePreviewFunc)

function hideShowDiv(val){
    if(val == 2){
        imagePickerContainer.style.display = "block";
        document.getElementById("image").required = true;
    }
    if(val == 1){
        imagePickerContainer.style.display = "none";
        document.getElementById("image").required = false;
    }
}

function imagePreviewFunc(){
    const files = filePickerElement.files; 
    if(!files || files.length === 0){
        imagePreviewElement.style.display = "none"
        return;
    }

    const pickedFile = files[0]
    imagePreviewElement.src  = URL.createObjectURL(pickedFile)
    imagePreviewElement.style.display = "block"
}