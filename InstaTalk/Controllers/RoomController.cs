using InstaTalk.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

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

        [HttpPost]
        public async Task<IActionResult> ChangeRoomSercurityCode([FromBody] EditRoomModel editRoomModel)
        {
            var baseUrl = _configuration.GetValue<string>("APIUrl");

            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl);

                EditRoomModel editRoom = new EditRoomModel
                {
                    RoomId = editRoomModel.RoomId,
                    RoomName = editRoomModel.RoomName,
                    SecurityCode = editRoomModel.SecurityCode
                };

                var endpoint = "api/Room";
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", HttpContext.Session.GetString("token"));
                var response = await client.PutAsJsonAsync(endpoint, editRoom);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    RoomModel room = JsonConvert.DeserializeObject<RoomModel>(result);
                    Console.WriteLine("Success change sercurity of room with roomID is: ", room.RoomId);
                    return Json(new { message = "OK" });
                }
                else
                {
                    Console.WriteLine("Error change sercurity of room");
                    return Json(new { message = "Error" });
                }
            }
        }
    }
}
