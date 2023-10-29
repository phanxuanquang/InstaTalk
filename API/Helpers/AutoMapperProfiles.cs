using AutoMapper;
using API.Dtos;
using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(s => s.Id, options => options.MapFrom(t => t.Id.ToString().ToLower()));

            CreateMap<RegisterDto, AppUser>();

            CreateMap<JoinRoomDto, AppUser>();

            CreateMap<Room, RoomDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.AppUser.UserName));
        }
    }
}
