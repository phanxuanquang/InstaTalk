using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class EditRoomDto
    {
        [Required]
        public int RoomId { get; set; }
        [Required]
        public string RoomName { get; set; } = null!;
        [Required]
        public string SecurityCode { get; set; } = null!;
    }
}
