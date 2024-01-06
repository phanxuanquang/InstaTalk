using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Room
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RoomId { get; set; }

        public string? RoomName { get; set; }

        public string? SecurityCode { get; set; }

        public int CountMember { get; set; }

        public AppUser AppUser { get; set; }

        public Guid UserId { get; set; }

        public DateTime CreatedDate { get; set; }

        [DefaultValue(false)]
        public bool BlockedChat { get; set; }

        public ICollection<Connection> Connections { get; set; } = new List<Connection>();
    }

    public class Connection
    {
        public Connection() { }

        public Connection(string connectionId, Guid userId)
        {
            ConnectionId = connectionId;
            UserID = userId;
        }

        [Key]
        public string ConnectionId { get; set; }

        public Guid UserID { get; set; }
    }
}
