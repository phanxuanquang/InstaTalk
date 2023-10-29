namespace InstaTalk.Models
{
    public class RoomModel
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public int CountMember { get; set; }
    }
}
