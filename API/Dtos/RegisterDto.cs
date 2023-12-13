using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required]
        [StringLength(20, MinimumLength = 6)]
        public string RoomName { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6)]
        public string DisplayName { get; set; }

        public string SecurityCode { get; set; }
    }
}
