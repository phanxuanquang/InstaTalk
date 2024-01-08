const strangerService = new StrangerHubService();

strangerService.createHubConnection(ObjClient.User, ObjClient.Room.roomId);

strangerService.joinStranger$.subscribe(roomId => {
    let name = document.getElementById("stranger_display_name");
    name.innerHTML = roomId;
    var postData = {
        RoomId: roomId,
        SecurityCode: "",
    };
    fetch("/Stranger/Matching", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
});
