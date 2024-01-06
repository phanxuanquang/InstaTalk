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
    var label = document.getElementById("lb-input-room-mate-id");
    input.value = '';
    input.focus();
    input.blur();
}

$(document).ready(function () {
    let input_room_id = document.getElementById("input_room_id");
    if (input_room_id.value != "") {
        let btn_join_room = document.getElementById("btn_join_room");
        btn_join_room.click();
    }
});