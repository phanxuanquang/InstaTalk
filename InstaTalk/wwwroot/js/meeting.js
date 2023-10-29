var isMicClicked = true;
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
    var btn = document.getElementById("btn_mic_meeting");
    icon.style.transition = "transform 0.5s ease";
    if (isMicClicked) {
        icon.innerHTML = "mic_off";
        isMicClicked = false;
        btn.classList.add("btn-danger");
    } else {
        icon.innerHTML = "mic";
        isMicClicked = true;
        btn.classList.remove("btn-danger");
    }
}
function changeCamState() {
    var icon = document.getElementById("icon_cam_meeting");
    var btn = document.getElementById("btn_cam_meeting");
    icon.style.transition = "transform 0.5s ease";
    if (isCamClicked) {
        icon.innerHTML = "videocam_off";
        isCamClicked = false;
        btn.classList.add("btn-danger");
    } else {
        icon.innerHTML = "videocam";
        isCamClicked = true;
        btn.classList.remove("btn-danger");
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
var state = Math.floor(Math.random() * 10) % 2;
console.log(state);
let myPeer;
function InitRTC() {
    myPeer = new Peer(state == 1 ? "back" : "down", {
        config: {
            'iceServers': [
                {
                    urls: "stun:stun.relay.metered.ca:80",
                },
                {
                    urls: "turn:a.relay.metered.ca:80",
                    username: "4af24cfab7a9e683a59be531",
                    credential: "N7WeALiaXC9Ti5i0",
                },
                {
                    urls: "turn:a.relay.metered.ca:80?transport=tcp",
                    username: "4af24cfab7a9e683a59be531",
                    credential: "N7WeALiaXC9Ti5i0",
                },
                {
                    urls: "turn:a.relay.metered.ca:80?transport=udp",
                    username: "4af24cfab7a9e683a59be531",
                    credential: "N7WeALiaXC9Ti5i0",
                },
                {
                    urls: "turn:a.relay.metered.ca:443",
                    username: "4af24cfab7a9e683a59be531",
                    credential: "N7WeALiaXC9Ti5i0",
                },
                {
                    urls: "turn:a.relay.metered.ca:443?transport=tcp",
                    username: "4af24cfab7a9e683a59be531",
                    credential: "N7WeALiaXC9Ti5i0",
                },
                {
                    urls: "turn:a.relay.metered.ca:443?transport=udp",
                    username: "4af24cfab7a9e683a59be531",
                    credential: "N7WeALiaXC9Ti5i0",
                },
            ]
        }
    });

    const conn = myPeer.connect(state == 1 ? "down" : "back");
    conn.on("open", () => {
        conn.send("hi!");
    })

    myPeer.on("connection", (conn) => {
        conn.on("data", (data) => {
            // Will print 'hi!'
            console.log(data);
        });
        conn.on("open", () => {
            conn.send("hello!");
        });
    });

    myPeer.on('open', userId => {
        console.log(userId)
        createLocalStream();
    });

    myPeer.on('call', (call) => {
        call.answer(this.stream);

        call.on('stream', (otherUserVideoStream) => {
            addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
        });

        call.on('error', (err) => {
            console.error(err);
        })
    });
}

function addOtherUserVideo(userId, stream) {
    console.log(userId + "addOtherUserVideo");
    $("#videoPlayer2").get(0).srcObject = stream;
    $("#videoPlayer2").get(0).load();
    $("#videoPlayer2").get(0).play();
}

async function createLocalStream() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        $("#videoPlayer").get(0).srcObject = stream;
        $("#videoPlayer").get(0).load();
        $("#videoPlayer").get(0).play();
        const call = myPeer.call(state == 1 ? "down" : "back", stream, {
            metadata: { userId: state == 1 ? "back" : "down" },
        });

        call.on('stream', (otherUserVideoStream) => {
            console.log(call.metadata.userId + "createLocalStream");
            $("#videoPlayer2").get(0).srcObject = otherUserVideoStream;
            $("#videoPlayer2").get(0).load();
            $("#videoPlayer2").get(0).play();
        });

        call.on('close', () => {

        });
    } catch (error) {
        console.error(error);
        alert(`Can't join room, error ${error}`);
    }
}

$(document).ready(function () {
    InitRTC();
});