﻿using Microsoft.AspNetCore.Identity;
using System;

namespace API.Entities
{
    public class AppUserRole : IdentityUserRole<Guid>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}
