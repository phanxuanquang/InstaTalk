using InstaTalk.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace InstaTalk.Controllers
{
    public class RoomController : Controller
    {
        private readonly IConfiguration _configuration;

        public RoomController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index(int roomId)
        {
            var content = HttpContext.Session.GetString("sessionRoom");
            if (string.IsNullOrEmpty(content))
                return RedirectToAction("Index", "Home");

            var model = JsonConvert.DeserializeObject<RoomInfo>(content);

            ViewBag.API = _configuration.GetValue<string>("APIUrl");

            return View(model);
        }

        public async Task<IActionResult> Meeting(Guid roomId)
        {
            var content = HttpContext.Session.GetString("sessionRoom");
            if (string.IsNullOrEmpty(content))
                return RedirectToAction("Index", "Home");

            var model = JsonConvert.DeserializeObject<RoomInfo>(content);

            ViewBag.API = new { API = _configuration.GetValue<string>("APIUrl") };

            return View(model);
        }
    }
}
