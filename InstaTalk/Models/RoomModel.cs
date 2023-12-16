
using System.ComponentModel;

namespace InstaTalk.Models
{
    public class RoomModel
    {
        public Guid RoomId { get; set; }
        public string RoomName { get; set; }

        public string SecurityCode { get; set; }
        public int CountMember { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public DateTime CreatedDate { get; set; }
        [DefaultValue(false)]
        public bool BlockedChat { get; set; }

    }
}
