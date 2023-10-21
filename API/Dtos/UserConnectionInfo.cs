using System;

namespace API.Dtos
{
    public class UserConnectionInfo
    {
        public UserConnectionInfo() { }
        public UserConnectionInfo(Guid userId, string displayName, int roomId)
        {
            UserID = userId;
            DisplayName = displayName;
            RoomId = roomId;
        }
        public Guid UserID { get; set; }
        public string DisplayName { get; set; }
        public int RoomId { get; set; }
    }
}
