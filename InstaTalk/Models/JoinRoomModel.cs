using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace InstaTalk.Models
{
    public class JoinRoomModel
    {
        [Required]
        public int RoomId { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6)]
        public string DisplayName { get; set; } = "Rommmmmmmm";

        public string? SecurityCode { get; set; } = null!;
    }
}
