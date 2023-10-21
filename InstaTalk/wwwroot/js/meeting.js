﻿var isMicClicked = true;
var isCamClicked = true;
var isVisibile = true;

$(window).on('load', function () {
    $('#ModalMeetingRoom').modal('show');
});
function closeChat() {
    var chat = document.getElementById("div_right_meeting");
    var left_meeting = document.getElementById("div_left_meeting");
    var meeting = document.getElementById("div_left_video_meeting");
    meeting.classList.remove("row-cols-2"); 
    meeting.classList.add("row-cols-4");
    left_meeting.classList.remove("col-8");
    left_meeting.classList.add("col-11");
    chat.classList.remove("d-flex");
    chat.style.display = "none";
}
function openChat() {
    var chat = document.getElementById("div_right_meeting");
    var left_meeting = document.getElementById("div_left_meeting");
    var meeting = document.getElementById("div_left_video_meeting");
    meeting.classList.remove("row-cols-4");
    meeting.classList.add("row-cols-2");
    left_meeting.classList.remove("col-11");
    left_meeting.classList.add("col-8");
    left_meeting.classList.remove();
    chat.classList.add("d-flex");
}
function changeMicState() {
    var icon = document.getElementById("icon_mic_meeting");
    icon.style.transition = "transform 0.5s ease";
    if (isMicClicked) {
        icon.innerHTML = "mic_off";
        isMicClicked = false;
    } else {
        icon.innerHTML = "mic";
        isMicClicked = true;
    }
}
function changeCamState() {
    var icon = document.getElementById("icon_cam_meeting");
    if (isCamClicked) {
        icon.innerHTML = "videocam_off";
        isCamClicked = false;
    } else {
        icon.innerHTML = "videocam";
        isCamClicked = true;
    }
}

function hiddenModal() {
    $('#ModalMeetingRoom').modal('hide');
}
function hiddenModalConfig() {
    $('#ModalSecurityConfig').modal('hide');
}
function changeConfigPassIcon() {
    var icon = document.getElementById("icon_pass_config");
    var input = document.getElementById("input_pass_config");
    if (isVisibile) {
        icon.innerHTML = "visibility_off";
        input.type = "password";
        isVisibile = false;
    } else {
        icon.innerHTML = "visibility";
        input.type = "text";
        isVisibile = true;
    }
}
function showModalConfig() {
    $('#ModalMeetingRoom').modal('hide');
    $('#ModalSecurityConfig').modal('show');
}
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;

function updateTimer() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
            minutes = 0;
            hours++;
        }
    }

    const formattedTime =
        `${hours.toString().padStart(2, '0')}:
                 ${minutes.toString().padStart(2, '0')}:
                 ${seconds.toString().padStart(2, '0')}`;

    document.getElementById('time_meeting').textContent = formattedTime;
}

// Start the timer
timerInterval = setInterval(updateTimer, 1000); // Update every second (1000 milliseconds)