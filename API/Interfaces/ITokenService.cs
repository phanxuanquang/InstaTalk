using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(AppUser appUser);
    }
}
