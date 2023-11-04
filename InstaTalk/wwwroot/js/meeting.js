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
    icon.style.transition = "transform 0.5s ease"
    icon.style.transform = "transform 0.5s ease";
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
    icon.style.transform = "transform 0.5s ease";
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
//var toastList = toastElList.map(function (toastEl) {
//    return new bootstrap.Toast(toastEl, option)
//})
function openFileSelector() {
    // Get the file input element by its ID
    var fileInput = document.getElementById("file-input");

    // Trigger a click event on the file input
    fileInput.click();
}

// Create an instance of the ChatHubService
const chatService = new ChatHubService(muteCamMicService, messageCountService);

// Usage:

chatService.createHubConnection(ObjClient.User, ObjClient.Room.roomId);

const presenceService = new PresenceService(utility);

presenceService.createHubConnection(ObjClient.User);

var myPeer;
var subscriptions = new Subscription();
var stream;
var videos = [];

var videoSource = new Subject();
var videoObs$ = videoSource.asObservable();

var tempvideos = [];
const localView = document.getElementById("user_video");
const localTitle = document.getElementById("title_video");

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
            newVideo.setAttribute("muted", '');
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

function InitRTC() {
    myPeer = new Peer(ObjClient.User.userId, {
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
            this.messageInGroup = messages;
        })
    );

    //hien thi so tin nhan chua doc
    this.subscriptions.add(
        messageCountService.messageCount$.subscribe(value => {
            this.messageCount = value;
        })
    );

    /*// bat che do share 1 man hinh len, nhan tu chatHub
    this.subscriptions.add(
        this.shareScreenService.shareScreen$.subscribe(val => {
            if (val) {//true = share screen
                this.statusScreen = eMeet.SHARESCREEN
                this.enableShareScreen = false;
                localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
            } else {// false = stop share
                this.statusScreen = eMeet.NONE
                this.enableShareScreen = true;
                localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
            }
        })
    )

    // bat dau share stream toi user vao sau cung tu user xuat phat stream
    this.subscriptions.add(this.shareScreenService.lastShareScreen$.subscribe(val => {
        if (val.isShare) {//true = share screen        
            chatService.shareScreenToUser(Number.parseInt(this.roomId), val.id, true)
            setTimeout(() => {
                const call = this.shareScreenPeer.call('share_' + val.id, this.shareScreenStream);
            }, 1000)
        }
    }))*/

    this.subscriptions.add(utility.kickedOutUser$.subscribe(val => {
        this.isMeeting = false
        this.accountService.logout()
        this.toastr.info('You have been locked by admin')
        this.router.navigateByUrl('/login')
    }))

    /*this.subscriptions.add(this.shareScreenService.userIsSharing$.subscribe(val => {
        this.userIsSharing = val
    }))*/
}

/*function addOtherUserVideo(userId, stream) {
    console.log(userId + "addOtherUserVideo");
    $("#videoPlayer2").get(0).srcObject = stream;
    $("#videoPlayer2").get(0).load();
    $("#videoPlayer2").get(0).play();
}*/
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
    tempvideos.forEach(video => { var newDiv = document.createElement("video"); newDiv.srcObject = video.srcObject; newDiv.load(); newDiv.play(); })
}

async function createLocalStream() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localView.srcObject = stream;
        localTitle.innerHTML = ObjClient.User.displayName;
        localView.load();
        localView.play();
    } catch (error) {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localView.srcObject = stream;
        localTitle.innerHTML = ObjClient.User.displayName;
        localView.load();
        localView.play();
        console.error(error);
        alert(`Can't join room, error ${error}`);
    }
}

$(document).ready(function () {
    InitRTC();
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
