var isMicClicked = true;
var isCamClicked = true;
var isVisibile = true;
var isExpanded = true;

$(window).on('load', function () {
    $('#ModalMeetingRoom').modal('show');
    changeMicState();
    changeCamState();
});

function expand() {
    var sideBar = document.getElementById("side_bar_control");
    var btnExpand = document.getElementById("btn-icon-expand");
    
    if (isExpanded) {
        sideBar.classList.add("side_bar_control");
        sideBar.style.display = "block";
        isExpanded = false;
        btnExpand.style.transform = "rotate(180deg)";
        btnExpand.style.transition = "transform 0.5s ease"; 
    }
    else {
        sideBar.classList.remove("side_bar_control");
        sideBar.style.display = "none";
        isExpanded = true;
        btnExpand.style.transform = "rotate(360deg)";
        btnExpand.style.transition = "transform 0.5s ease"; 
    }
}

//function minimize() {
//    var sideBar = document.getElementById("side_bar_control");
//    var btnExpand = document.getElementById("btn-icon-expand");
//    btnExpand.style.display = "flex";
//    sideBar.classList.remove("side_bar_control");
//    sideBar.style.display = "none";
//}

function closeChat() {
    var windowWidth = document.body.clientWidth;
    if (windowWidth > 820) {
        var chat = document.getElementById("div_right_meeting");
        var left_meeting = document.getElementById("div_left_meeting");
        var meeting = document.getElementById("div_left_video_meeting");
        left_meeting.classList.remove("col-8");
        left_meeting.classList.add("col-11");
        chat.classList.remove("d-flex");
        chat.classList.remove("col-11");
        chat.style.display = "none";
    }
    else {
        var chat = document.getElementById("div_right_meeting");
        var left_meeting = document.getElementById("div_left_meeting");
        left_meeting.style.display = "block"; 
       left_meeting.classList.remove("col-8");
        left_meeting.classList.add("col-11");
        chat.classList.remove("d-flex");
        chat.classList.remove("col-11");
        chat.style.display = "none";
    }
}
function openChat() {
    var windowWidth = document.body.clientWidth;
    if (windowWidth > 820) {
        var chat = document.getElementById("div_right_meeting");
        var left_meeting = document.getElementById("div_left_meeting");
        var meeting = document.getElementById("div_left_video_meeting");
        left_meeting.classList.remove("col-11");
        left_meeting.classList.add("col-8");
        left_meeting.classList.remove();
        chat.classList.add("d-flex");
    }
    else {
        var chat = document.getElementById("div_right_meeting");
        var left_meeting = document.getElementById("div_left_meeting");
        left_meeting.style.display = "none";
        chat.classList.add("d-flex");
        chat.classList.add("col-11");
    }
}
function changeMicState() {
    var icon = document.getElementById("icon_mic_meeting");
    var btn = document.getElementById("btn_mic_meeting");
    btn.style.transition = "transform 0.5 ease";
    btn.style.transform = "transform 0.5s ease";
    if (isMicClicked) {
        icon.innerHTML = "mic_off";
        isMicClicked = false;
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-light");
    } else {
        icon.innerHTML = "mic";
        isMicClicked = true;
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-light");

    }
}
function changeCamState() {
    var icon = document.getElementById("icon_cam_meeting");
    var btn = document.getElementById("btn_cam_meeting");
    icon.style.transition = "transform 0.5 ease";
    if (isCamClicked) {
        icon.innerHTML = "videocam_off";
        isCamClicked = false;
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-light");
    } else {
        icon.innerHTML = "videocam";
        isCamClicked = true;
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-light");
    }
}

function hiddenModal() {
    $('#ModalMeetingRoom').modal('hide');
}
function hiddenModalConfig() {
    $('#ModalSecurityConfig').modal('hide');
}

function showModalConfig() {
    $('#ModalMeetingRoom').modal('hide');
    $('#ModalSecurityConfig').modal('show');
}
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;

// Start the timer
timerInterval = setInterval(updateTimer, 1000); // Update every second (1000 milliseconds)
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
function setCopyState(){
    var icon = document.getElementById("icon_copy_url");
    icon.innerHTML = "done";
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl, option)
})
function openFileSelector() {
    // Get the file input element by its ID
    var fileInput = document.getElementById("file-input");

    // Trigger a click event on the file input
    fileInput.click();
}

function toggleComponents() {
    var checkbox = document.getElementById("switch");

    var parentDiv = document.getElementById("div_right_meeting");

    var formElements = parentDiv.querySelectorAll("select, textarea, button");

    var disable = !checkbox.checked;

    formElements.forEach(function (element) {
        element.disabled = disable;
    });
}
