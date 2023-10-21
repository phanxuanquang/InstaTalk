var SignalrConnection;
var ChatProxy;

function Connect() {
    ChatServerUrl = "http://localhost:58416/";
    var ChatUrl = ChatServerUrl + "signalr";
    //This will hold the connection to the signalr hub   
    SignalrConnection = $.hubConnection(ChatUrl, {
        useDefaultPath: false
    });
    ChatProxy = SignalrConnection.createHubProxy('ChatHub');
    //connecting the client to the signalr hub   
    SignalrConnection.start().done(function () {
        alert("Connected to Signalr Server");
    })
        .fail(function () {
            alert("failed in connecting to the signalr server");
        })
}