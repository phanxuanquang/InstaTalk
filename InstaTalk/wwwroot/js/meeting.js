﻿var isMuted = true;
var isStreamCam = false;

var isVisibile = true;
var isExpanded = true;
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;

const messageCountService = new MessageCountStreamService();
const muteCamMicService = new MuteCamMicService();

// Create an instance of the ChatHubService
const chatService = new ChatHubService(muteCamMicService, messageCountService);

// Usage:

chatService.createHubConnection(ObjClient.User, ObjClient.Room.roomId);

const presenceService = new PresenceService(utility);

presenceService.createHubConnection(ObjClient.User);

var myPeer; //for webcam
var shareScreenPeer; //fo share screen
var subscriptions = new Subscription();
var stream;
var videos = [];

var videoSource = new Subject();
var videoObs$ = videoSource.asObservable();

var shareScreenStream;
var shareScreenSource = new Subject();
var shareScreenObs$ = shareScreenSource.asObservable();

var isSharingScreenSource = new Subject();
var isSharingScreen$ = isSharingScreenSource.asObservable();
var tempvideos = [];
const localView = document.getElementById("user_video");
const localTitle = document.getElementById("title_video");

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
    icon.style.transition = "transform 0.5s ease"
    icon.style.transform = "transform 0.5s ease";
    if (isMuted) {
        icon.innerHTML = "mic_off";
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-light");
    } else {
        icon.innerHTML = "mic";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-light");
    }

    if (stream)
        stream.getAudioTracks()[0].enabled = !isMuted;
    chatService.muteMicroPhone(isMuted);

    isMuted = !isMuted;
}
function changeCamState() {
    var icon = document.getElementById("icon_cam_meeting");
    var btn = document.getElementById("btn_cam_meeting");
    icon.style.transition = "transform 0.5 ease";
    icon.style.transform = "transform 0.5s ease";

    if (isStreamCam) {
        icon.innerHTML = "videocam";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-light");
    } else {
        icon.innerHTML = "videocam_off";
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-light");
    }

    if (stream)
        stream.getVideoTracks()[0].enabled = isStreamCam;
    chatService.muteCamera(!isStreamCam);

    isStreamCam = !isStreamCam;
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
function setCopyState() {
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
//var toastList = toastElList.map(function (toastEl) {
//    return new bootstrap.Toast(toastEl, option)
//})
function openFileSelector() {
    // Get the file input element by its ID
    var fileInput = document.getElementById("file-input");

    // Trigger a click event on the file input
    fileInput.click();
}

this.isSharingScreen$.subscribe(event => {
    var icon = document.getElementById("icon_sharing_screen");
    var btn = document.getElementById("btn_sharing_screen");
    icon.style.transition = "transform 0.5s ease"
    icon.style.transform = "transform 0.5s ease";

    if (event) {
        icon.innerHTML = "mic";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-light");
    }
    else {
        icon.innerHTML = "mic_off";
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-light");
    }
});

videoObs$.subscribe((val) => {
    console.log(val);
    var views = $("#div_left_video_meeting").children();

    let mapUserIDs = val.map(item => item.user.id);
    let userViewed = [];

    for (let i = 0; i < views.length; i++)
        userViewed.push(views[i].id);

    for (let i = 0; i < views.length; i++)
        if (!mapUserIDs.includes(views[i].id) && views[i].id !== "div_user_video")
            views[i].remove();

    let newVideos = val.filter(item => !userViewed.includes(item.user.id))
        .map(item => {
            var newVideo = localView.cloneNode(true);
            var parent = document.getElementById("div_user_video");
            var title = document.getElementById("title_video");
            var x = parent.cloneNode(true);
            x.innerHTML = '';
            x.id = item.user.id;
            var y = title.cloneNode(true);
            y.innerHTML = item.user.displayName;
            newVideo.srcObject = item.srcObject;
            newVideo.muted = true;
            newVideo.load();
            newVideo.play();
            x.append(newVideo);
            x.append(y);
            return x;
        });

    if (newVideos && newVideos.length > 0) {
        $("#div_left_video_meeting").append(newVideos);
    }

    var currentViews = $("#div_left_video_meeting").children();
    var widthBase;
    var heightBase;
    if (currentViews.length <= 4) {
        widthBase = 2;
        if (currentViews.length == 2)
            heightBase = 100;
        else
            heightBase = 50;
    }
    else if (currentViews.length <= 9) {
        widthBase = 3;
        if (currentViews.length <= 6)
            heightBase = 50;
        else
            heightBase = (100 / 3);
    }
    else if (currentViews.length <= 16) {
        widthBase = 4;
        if (currentViews.length <= 12)
            heightBase = (100 / 3);
        else
            heightBase =25;
    }
    for (let i = 0; i < currentViews.length; i++) {
        var temp = document.getElementById("div_left_video_meeting");
        temp.classList.add("row-cols-" + widthBase);
        currentViews[i].style.height = heightBase + "%";
    }
});

shareScreenObs$.subscribe(event => {
    this.shareScreenStream = event;

    let shareView = document.getElementById("share-video");
    if (this.shareScreenStream && this.shareScreenStream.active) {
        shareView.srcObject = this.shareScreenStream;
        shareView.muted = true;
        shareView.load();
        shareView.play();
    }
    else {
        shareView.srcObject = undefined;
        shareView.muted = true;
        shareView.load();
        shareView.pause();
    }
});

muteCamMicService.muteCamera$.subscribe(event => {
    console.log(event)
});

muteCamMicService.muteCamera$.subscribe(event => {
    console.log(event);
});

muteCamMicService.shareScreen$.subscribe(event => {
    console.log(event);
});

function InitRTC() {
    //#region Init myPeer
    myPeer = new Peer(ObjClient.User.userId, {
        config: config
    });

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
        call.answer(stream);

        call.on('stream', (otherUserVideoStream) => {
            addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
        });

        call.on('error', (err) => {
            console.error(err);
        })
    });

    this.subscriptions.add(
        chatService.oneOnlineUser$.subscribe(member => {
            if (ObjClient.User.userId !== member.id) {
                // Let some time for new peers to be able to answer
                setTimeout(() => {
                    const call = myPeer.call(member.id, stream, {
                        metadata: {
                            userId: {
                                id: ObjClient.User.userId,
                                displayName: ObjClient.User.displayName,
                                lastActive: ObjClient.User.lastActive,
                            }
                        },
                    });

                    call.on('stream', (otherUserVideoStream) => {
                        this.addOtherUserVideo(member, otherUserVideoStream);
                    });

                    call.on('close', () => {
                        videos = videos.filter((video) => video.user.id !== member.id);
                        //xoa user nao offline tren man hinh hien thi cua current user
                        this.tempvideos = this.tempvideos.filter(video => video.user.id !== member.id);

                        videoSource.next(videos);
                    });
                }, 1000);
            }
        })
    );

    this.subscriptions.add(chatService.oneOfflineUser$.subscribe(member => {
        videos = videos.filter(video => video.user.id !== member.id);
        //xoa user nao offline tren man hinh hien thi current user
        this.tempvideos = this.tempvideos.filter(video => video.user.id !== member.id);
        videoSource.next(videos);
    }));

    this.subscriptions.add(
        chatService.messagesThread$.subscribe(messages => {
            chatMessageList = messages;
            chatSource.next(chatMessageList);
        })
    );

    //hien thi so tin nhan chua doc
    this.subscriptions.add(
        messageCountService.messageCount$.subscribe(value => {
            this.messageCount = value;

        })
    );
    //#endregion

    //#region Init shareScreenPeer
    shareScreenPeer = new Peer('share_' + ObjClient.User.userId, {
        config: config
    })

    shareScreenPeer.on('call', (call) => {
        call.answer(this.shareScreenStream);
        call.on('stream', (otherUserVideoStream) => {
            this.shareScreenSource.next(otherUserVideoStream);
        });

        call.on('error', (err) => {
            console.error(err);
        })
    });

    // bat che do share 1 man hinh len, nhan tu chatHub
    this.subscriptions.add(
        muteCamMicService.shareScreen$.subscribe(val => {
            if (val) {//true = share screen
                /*this.statusScreen = eMeet.SHARESCREEN
                this.enableShareScreen = false;
                localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));*/
            } else {// false = stop share
                /*this.statusScreen = eMeet.NONE
                this.enableShareScreen = true;
                localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));*/
            }
        })
    )

    // bat dau share stream toi user vao sau cung tu user xuat phat stream
    this.subscriptions.add(muteCamMicService.lastShareScreen$.subscribe(val => {
        if (val.isShare) {//true = share screen        
            chatService.shareScreenToUser(ObjClient.Room.roomId, val.userIdTo, true)
            setTimeout(() => {
                const call = this.shareScreenPeer.call('share_' + val.userIdTo, this.shareScreenStream);
            }, 1000)
        }
    }))

    this.subscriptions.add(muteCamMicService.userIsSharing$.subscribe(val => {
        this.userIsSharing = val
    }))
    //#endregion

    this.subscriptions.add(utility.kickedOutUser$.subscribe(val => {
        this.isMeeting = false
        this.accountService.logout()
        this.toastr.info('You have been locked by admin')
        this.router.navigateByUrl('/login')
    }))

    /*this.subscriptions.add(this.shareScreenService.userIsSharing$.subscribe(val => {
        this.userIsSharing = val
    }))*/
    chatForm.addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Call the sendMessage function
        sendMessage();
    });


}

function addOtherUserVideo(user, stream) {
    const alreadyExisting = videos.some(video => video.user.id === user.id);
    if (alreadyExisting) {
        console.log(videos, user);
        return;
    }

    videos.push({
        muted: false,
        srcObject: stream,
        user: user
    });

    videoSource.next(videos);

    if (videos.length <= this.maxUserDisplay) {
        this.tempvideos.push({
            muted: false,
            srcObject: stream,
            user: user
        })
    }
}

async function createLocalStream() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (error) {
        stream = new webkitMediaStream();
    }

    try {
        localView.srcObject = stream;
        localView.muted = true;
        localTitle.innerHTML = ObjClient.User.displayName;
        localView.muted = true;
        localView.load();
        localView.play();
    }
    catch (error) {
        console.error(error);
        alert(`Can't join room, error ${error}`);
    }
}

async function shareScreen() {
    try {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        chatService.shareScreen(ObjClient.Room.roomId, true);
        this.shareScreenSource.next(mediaStream);
        this.isSharingScreenSource.next(true);

        this.videos.forEach(v => {
            const call = this.shareScreenPeer.call('share_' + v.user.id, mediaStream);
        })

        mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
            this.chatService.shareScreen(ObjClient.Room.roomId, false);
            this.isSharingScreenSource.next(false);
            localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
        });
    } catch (e) {
        console.log(e);
        alert(e)
    }
}

var chatMessageList = [];
var chatSource = new Subject();
var chatObs$ = chatSource.asObservable();




var chatForm = document.getElementById("chat-input");

// Create an input element for content
var input = document.getElementById("input_chat_meeting");
input.setAttribute("type", "text");
input.setAttribute("name", "content");
input.setAttribute("required", "true");

var myChatClone = document.getElementById("my_chat_message")
var myChatDisplay = document.getElementById("div_chat_right_meeting");

// Define a function to send the message
function sendMessage() {
    // Get the content value from the input
    var content = input.value;
    // Use JSON.stringify to convert the content to a JSON string
    var contentJSON = JSON.stringify(content);

    // Send the message using the chatHub object
    chatService.sendMessage(content).then(() => {
        // Reset the form after sending the message
        chatForm.reset();

    });
}

chatObs$.subscribe((val) => {
    while (myChatDisplay.firstChild) {
        myChatDisplay.removeChild(myChatDisplay.lastChild);
    }
    for (let i = 0; i < val.length; i++) {
        //Tao div message
        var chat = myChatClone.cloneNode(true);
        //createMessage(content);
        chat.innerHTML = val[i].content;
        myChatDisplay.append(chat);
    }
})

$(document).ready(function () {
    InitRTC();

    $('#ModalMeetingRoom').modal('show');
    changeMicState();
    changeCamState();
});
function toggleComponents() {
    var checkbox = document.getElementById("switch");

    var parentDiv = document.getElementById("div_right_meeting");

    var formElements = parentDiv.querySelectorAll("select, textarea, button");

    var disable = !checkbox.checked;

    formElements.forEach(function (element) {
        element.disabled = disable;
    });
}
