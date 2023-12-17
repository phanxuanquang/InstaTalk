var isMuted = true;
var isStreamCam = false;
var isSharingScreen = false;
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
var parent = document.getElementById("div_user_video");
var userCard = document.getElementById("div_user_card");
var isSharingScreenSource = new Subject();
var isSharingScreen$ = isSharingScreenSource.asObservable();
var tempvideos = [];
const localView = document.getElementById("user_video");
const localUserCard = document.getElementById("div_user_card");
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
    var div_user_card = document.getElementById("div_user_card");
    var user_video = document.getElementById("user_video");
    var title_video = document.getElementById("title_video");
    var name_user_card = document.getElementById("name_user_card");
    icon.style.transition = "transform 0.5 ease";
    icon.style.transform = "transform 0.5s ease";

    if (isStreamCam) {
        icon.innerHTML = "videocam";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-light");
        div_user_card.style.display = "none";
        div_user_card.classList.remove("d-flex");
        user_video.style.display = "block";
        title_video.style.display = "block";
    } else {
        icon.innerHTML = "videocam_off";
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-light");
        div_user_card.style.display = "block";
        div_user_card.classList.add("d-flex");
        name_user_card.innerHTML = ObjClient.User.displayName;
        user_video.style.display = "none";
        title_video.style.display = "none";
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

function sendFileHandler(event) {
    var file = event.target.files[0];
    var arrayBuffer;

    var fileReader = new FileReader();
    fileReader.onload = function () {
        arrayBuffer = this.result;
        Object.keys(myPeer.connections).forEach(peerId => {
            const conn = myPeer.connect(peerId);
            if (conn) {
                conn.on('open', () => {
                    conn.send({
                        file: arrayBuffer,
                        metadata: {
                            name: file.name,
                            fileSize: file.size,
                            sentBy: {
                                userId: ObjClient.User.userId,
                                displayName: ObjClient.User.displayName
                            }
                        }
                    });
                })
            }
        })
    };
    fileReader.readAsArrayBuffer(file);
}

function addDivForUser(item) {
    var newVideo = localView.cloneNode(true);
    var title = document.getElementById("title_video");
    var x = parent.cloneNode(true);
    x.innerHTML = '';
    x.id = item.user.id;
    var y = title.cloneNode(true);
    y.innerHTML = item.user.displayName;
    var z = userCard.cloneNode(true);
    z.classList.add("d-flex");
    z.style.display = "block";
    var name_user_card = z.querySelector('#name_user_card');
    name_user_card.innerHTML = item.user.displayName.charAt(0).toUpperCase();
    newVideo.srcObject = item.srcObject;
    newVideo.muted = true;
    newVideo.id = item.user.id + "_video";
    newVideo.style.display = "none";
    y.style.display = "none";
    newVideo.load();
    newVideo.play();
    x.append(newVideo);
    x.append(y);
    x.append(z);
    return x;
}

function arrangeUser(currentViews) {
    let heightBase;
    let widthBase;
    let col;
    if (currentViews.length == 1) {
        heightBase = 100;
        widthBase = 100;
        col = 1;
    }
    else if (currentViews.length == 2) {
        heightBase = 100;
        widthBase = 50;
        col = 2;
    }
    else if (currentViews.length <= 4) {
        heightBase = 50;
        widthBase = 50;
        col = 2;
    }
    else if (currentViews.length <= 6) {
        heightBase = 50;
        widthBase = 100 / 3;
        col = 3;
    }
    else if (currentViews.length <= 9) {
        heightBase = 100 / 3;
        widthBase = 100 / 3;
        col = 3;
    }
    else {
        heightBase = 100 / 4;
        widthBase = 100 / 4;
        col = 4;
    }
    let divLeftVideoMeeting = document.getElementById("div_left_video_meeting");
    divLeftVideoMeeting.classList.add("row");
    divLeftVideoMeeting.classList.add("row-cols-" + col);
    for (let i = 0; i < currentViews.length; i++) {
        currentViews[i].style.height = heightBase + "%";
        currentViews[i].style.width = widthBase + "%";
    }
}

function arrangeUserWhenShare(currentViews) {
    let divLeftVideoMeeting = document.getElementById("div_left_video_meeting");
    divLeftVideoMeeting.classList.remove("row");
    console.log("arrangeUserWhenShare");
    let heightBase;
    let widthBase = 100;
    switch (currentViews.length) {
        case 1:
            heightBase = 100;
            break;
        case 2:
            heightBase = 50;
            break;
        case 3:
            heightBase = 100 / 3;
            break;
        case 4:
            heightBase = 25;
            break;
        default:
            console.log("so luong user > 4");
            heightBase = 25;
            var x = parent.cloneNode(true);
            x.innerHTML = '';
            x.id = "parent_count_remainder";
            let divCountRemainder = document.getElementById("div_count_remainder");
            let _divCountRemainder = divCountRemainder.cloneNode(true);
            let countRemainder = _divCountRemainder.querySelector("#count_remainder");
            countRemainder.innerHTML = "+" + (currentViews.length - 3).toString();
            _divCountRemainder.style.display = "block";
            x.append(_divCountRemainder);
            $("#div_left_video_meeting").append(x);
            currentViews = $("#div_left_video_meeting").children();
            for (let i = 0; i < 3; i++) {
                currentViews[i].style.height = heightBase + "%";
                currentViews[i].style.width = widthBase + "%";
            }
            for (let i = 3; i < currentViews.length - 1; i++) {
                currentViews[i].style.display = "none";
            }
            currentViews[currentViews.length - 1].style.height = heightBase + "%";
            return;

    }
    for (let i = 0; i < currentViews.length; i++) {
        currentViews[i].style.height = heightBase + "%";
        currentViews[i].style.width = widthBase + "%";
    }
}

function changeShareScreenState() {
    var icon = document.getElementById("icon_sharing_screen");
    var btn = document.getElementById("btn_sharing_screen");
    icon.style.transition = "transform 0.5s ease"
    icon.style.transform = "transform 0.5s ease";

    if (isSharingScreen) {
        icon.innerHTML = "screen_share";
        btn.classList.remove("btn-danger");
        btn.classList.add("btn-sucess");
    }
    else {
        icon.innerHTML = "stop_screen_share";
        btn.classList.add("btn-danger");
        btn.classList.remove("btn-sucess");
    }
}

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
            console.log("vao addDiv");
            console.log(item);
            return addDivForUser(item);
        });
    console.log("cai list video" + newVideos);
    if (newVideos && newVideos.length > 0) {
        $("#div_left_video_meeting").append(newVideos);
    }
    let currentViews = $("#div_left_video_meeting").children();
    if (isSharingScreen) {
        console.log("if access arrangeUserWhenShare");
        arrangeUserWhenShare(currentViews);
    }
    else {
        arrangeUser(currentViews);
    }
});

shareScreenObs$.subscribe(event => {
    let shareView = document.getElementById("share-video");
    let divShare = document.getElementById("div_share_screen");
    let divLeftVideoMeeting = document.getElementById("div_left_video_meeting");
    divShare.style.display = "none";
    shareView.pause();

    shareScreenStream = event;
    shareScreenStream.getVideoTracks()[0].addEventListener('ended', () => {
        chatService.shareScreen(ObjClient.Room.roomId, false);
        isSharingScreenSource.next(false);
    });

    if (shareScreenStream && shareScreenStream.active) {
        shareView.srcObject = shareScreenStream;
        shareView.muted = true;
        divShare.style.display = "block";
        divLeftVideoMeeting.classList.remove("w-100");
        divLeftVideoMeeting.classList.add("flex-fill");
        shareView.load();
        shareView.play();
        isSharingScreen = true;
        console.log("thay doi isSharingScreen: " + isSharingScreen);
    }
    else {
        shareView.srcObject = undefined;
        shareView.muted = true;
        divShare.style.display = "none";
        shareView.load();
        shareView.pause();
        divLeftVideoMeeting.classList.add("w-100");
        divLeftVideoMeeting.classList.remove("flex-fill");
        isSharingScreen = false;
        console.log("thay doi isSharingScreen: " + isSharingScreen);
    }
});

muteCamMicService.muteMicro$.subscribe(event => {
    let video = document.getElementById(event.userId + '_video')
    if (video)
        video.muted = event.mute;
});

muteCamMicService.muteCamera$.subscribe(event => {
    let div_user_video = document.getElementById(event.userId);
    let div_user_card = div_user_video.querySelector("#div_user_card");
    let user_video = document.getElementById(event.userId + '_video')
    console.log("Tim thay roi nha" + event.userId);
    let title_video = div_user_video.querySelector("#title_video");
    if (event.mute) {
        div_user_card.style.display = "block";
        div_user_card.classList.add("d-flex");
        user_video.style.display = "none";
        title_video.style.display = "none";
    } else {
        div_user_card.style.display = "none";
        div_user_card.classList.remove("d-flex");
        user_video.style.display = "block";
        title_video.style.display = "block";
    }
    console.log(event);
});

muteCamMicService.shareScreen$.subscribe(event => {
    console.log(event);
    if (event) {
        isSharingScreen = true;
        let currentViews = $("#div_left_video_meeting").children();
        arrangeUserWhenShare(currentViews);
    }
    else {
        isSharingScreen = false;
        changeShareScreenState();
        let currentViews = $("#div_left_video_meeting").children();
        let divShare = document.getElementById("div_share_screen");
        divShare.style.display = "none";
        let divLeftVideoMeeting = document.getElementById("div_left_video_meeting");
        divLeftVideoMeeting.classList.add("w-100");
        divLeftVideoMeeting.classList.remove("flex-fill");
        arrangeUser(currentViews);
    }
});

chatService.blockChat$.subscribe(state => {
    if (state) {
        $('#div_right_meeting').addClass("d-none");
    }
    else {
        $('#div_right_meeting').removeClass("d-none");
    }
});

function InitRTC() {
    //#region Init myPeer
    myPeer = new Peer(ObjClient.User.userId, {
        config: config
    });

    myPeer.on("connection", (conn) => {
        conn.on("data", (data) => {
            if (data?.file instanceof ArrayBuffer) {
                let metadata = data.metadata;
                var blob = new Blob([data]);
                var url = URL.createObjectURL(blob);

                // Create a link to download the file
                var downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = metadata.name;
                downloadLink.click();

            }
            else console.log(data);
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
                        console.log('call stream');
                        CallToast(member.displayName + ' has join room!')
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
        CallToast(member.displayName + ' has left room!')
        console.log('call close');
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
        changeShareScreenState();
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

var myChatClone = document.getElementById("my_chat_message");
var otherChatClone = document.getElementById("other_chat_message");
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
    console.log(val);
    for (let i = val.length - 1; i >= 0; i--) {
        //Tao div message
        const now = new Date();
        const h = now.getHours();
        var m;
        if (now.getMinutes() < 10) {
            m = "0" + now.getMinutes();
        } else {
            m = now.getMinutes();
        }
        if (val[i].senderUserID == ObjClient.User.userId) {
            var chat = myChatClone.cloneNode(true);
            var chat_message = chat.querySelector("#my_message");
            chat_message.innerHTML = val[i].content + '<span style="float:right;font-size:0.7rem;margin-top:0.5rem;margin-left:0.5rem">' + h + ":" + m + "</span>";
            myChatDisplay.append(chat);
        } else {
            var chat = otherChatClone.cloneNode(true);
            var chat_name = chat.querySelector("#other_name");
            chat_name.innerHTML = val[i].senderDisplayName;
            var chat_message = chat.querySelector("#other_message");
            chat_message.innerHTML = val[i].content + '<span style="float:right;font-size:0.7rem;margin-top:0.5rem;margin-left:0.5rem">' + h + ":" + m + "</span>";
            myChatDisplay.append(chat);
        }
    }
})

$(document).ready(function () {
    InitRTC();
    if (JSON.parse(window.atob(ObjClient.User.token.split('.')[1])).role == "Host") {
        $('#ModalMeetingRoom').modal('show');
    } else {
        hiddenForMembers();
    }
    changeMicState();
    changeCamState();
    setInterval(function () {
        $("#time_meeting").load(window.location.href + " #time_meeting");
    }, 1000);
});

function hiddenForMembers() {
    var btnSettings = document.getElementById("btn_settings_meeting");
    var btnSettingsMobile = document.getElementById("btn_settings_normal");
    btnSettings.style.display = "none";
    btnSettingsMobile.style.display = "none";
    btnSettings.classList.remove("d-flex");
    btnSettingsMobile.classList.remove("d-flex");
}
function toggleComponents() {
    var checkbox = document.getElementById("switch");

    var parentDiv = document.getElementById("div_right_meeting");

    var formElements = parentDiv.querySelectorAll("select, textarea, button");

    var disable = !checkbox.checked;

    let state = event.target.checked;
    chatService.blockChat(state);

    formElements.forEach(function (element) {
        element.disabled = disable;
    });
}
