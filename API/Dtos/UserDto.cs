using System;

namespace API.Dtos
{
    public class UserDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
        public DateTime LastActive { get; set; }
    }
}
