const strangerService = new StrangerHubService();

strangerService.createHubConnection(ObjClient.User, ObjClient.Room.roomId);

strangerService.joinStranger$.subscribe(roomId => {
    let name = document.getElementById("stranger_display_name");
    name.innerHTML = roomId;
});
