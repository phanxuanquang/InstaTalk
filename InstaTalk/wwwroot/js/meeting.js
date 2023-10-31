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
const localView = document.getElementById("videoPlayer");

videoObs$.subscribe((val) => {
    console.log(val);
    var views = $("#videos").children();

    let mapUserIDs = val.map(item => item.user.id);
    let userViewed = [];

    for (let i = 0; i < views.length; i++)
        userViewed.push(views[i].id);

    for (let i = 0; i < views.length; i++)
        if (!mapUserIDs.includes(views[i].id))
            views[i].remove();

    let newVideos = val.filter(item => !userViewed.includes(item.user.id))
        .map(item => {
            var newVideo = document.createElement("video");
            newVideo.id = item.user.id;
            newVideo.srcObject = item.srcObject;
            newVideo.setAttribute("muted", '');
            newVideo.load();
            newVideo.play();
            return newVideo
        });

    if (newVideos && newVideos.length > 0)
        $("#videos").append(newVideos);
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
        localView.load();
        localView.play();
    } catch (error) {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localView.srcObject = stream;
        localView.load();
        localView.play();
        console.error(error);
        alert(`Can't join room, error ${error}`);
    }
}

$(document).ready(function () {
    InitRTC();
});