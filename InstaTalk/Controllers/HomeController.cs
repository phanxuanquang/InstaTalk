using InstaTalk.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Security.Permissions;

namespace InstaTalk.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public HomeController(ILogger<HomeController> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult FriendHub(CreateRoomModel obj)
        {
            return View(obj);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoom(CreateRoomModel obj)
        {
            if (ModelState.IsValid)
            {
                using (var client = _httpClientFactory.CreateClient("API"))
                {
                    var response = await client.PostAsJsonAsync("/api/Room/add-room", obj);
                    if (response.IsSuccessStatusCode)
                    {
                        using (var content = response.Content)
                        {
                            var responseContent = await content.ReadFromJsonAsync<RoomInfo>();
                            HttpContext.Session.SetString("token", responseContent?.User?.Token ?? string.Empty);
                            HttpContext.Session.SetString("sessionRoom", JsonConvert.SerializeObject(responseContent));
                            return RedirectToAction("Meeting", "Room", responseContent?.Room?.RoomId);
                        }
                    }
                }
            }
            return RedirectToAction("FriendHub", obj);
        }
    }
}