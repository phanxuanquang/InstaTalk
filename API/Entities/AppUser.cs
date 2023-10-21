using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class AppUser : IdentityUser<Guid>
    {
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string DisplayName { get; set; }
        public bool Locked { get; set; } = false;// true = locked

        public string? PhotoUrl { get; set; }//Nullable<string>
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<Room> Rooms { get; set; }
    }
}
