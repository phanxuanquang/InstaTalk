var isClicked = false;
function changeIcon() {
    var icon = document.getElementById("icon_pass_off");
    var input = document.getElementById("input-pass-mate-room");
    if (isClicked) {
        icon.innerHTML = "visibility_off";
        input.type = "password";
        isClicked = false;
    } else {
        icon.innerHTML = "visibility";
        input.type = "text";
        isClicked = true;
    }
}

function clearText() {
    var input = document.getElementById("input-room-mate-id");
    input.value = "";
}