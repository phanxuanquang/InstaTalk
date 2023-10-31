using InstaTalk.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace InstaTalk.Controllers
{
    public class RoomController : Controller
    {
        public IActionResult Index(int roomId)
        {
            var content = HttpContext.Session.GetString("sessionRoom");
            if (string.IsNullOrEmpty(content))
                return RedirectToAction("Index", "Home");

            var model = JsonConvert.DeserializeObject<RoomInfo>(content);
            return View(model);
        }

        public async Task<IActionResult> Meeting(int roomId)
        {
            var content = HttpContext.Session.GetString("sessionRoom");
            if (string.IsNullOrEmpty(content))
                return RedirectToAction("Index", "Home");

            var model = JsonConvert.DeserializeObject<RoomInfo>(content);
            return View(model);
        }
    }
}
