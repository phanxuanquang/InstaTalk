using InstaTalk.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace InstaTalk.Controllers
{
    public class StrangerController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        private static StrangerModel _strangerModel = new StrangerModel();

        public StrangerController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public IActionResult Index()
        { 
            return View();
        }

        public IActionResult FindOut(StrangerModel obj)
        { 
            if (obj.DisplayName == null)
            {
                return RedirectToAction("Index", "Stranger");
            }
            _strangerModel = obj;
            return View(obj);
        }

        public async Task<IActionResult> Waiting(StrangerModel obj)
        {
            obj.DisplayName = _strangerModel.DisplayName;
            obj.Age = _strangerModel.Age;
            obj.Gender = _strangerModel.Gender;
            obj.Nationality = _strangerModel.Nationality;
            switch(obj.StrangerFilter.MinAge)
            {
                case 1:
                    obj.StrangerFilter.MinAge = 15;
                    obj.StrangerFilter.MaxAge = 18;
                    break;
                case 2:
                    obj.StrangerFilter.MinAge = 18;
                    obj.StrangerFilter.MaxAge = 24;
                    break;
                case 3:
                    obj.StrangerFilter.MinAge = 24;
                    obj.StrangerFilter.MaxAge = 30;
                    break;
                case 4:
                    obj.StrangerFilter.MinAge = 30;
                    obj.StrangerFilter.MaxAge = 100;
                    break;
            }
            RoomInfo? responseContent = null;
            using (var client = _httpClientFactory.CreateClient("API"))
            {
                var model = obj;
                model.RoomName = "test123";
                model.SecurityCode = "123456";
                var response = await client.PostAsJsonAsync("/api/Stranger/add-strager", model);
                if (response.IsSuccessStatusCode)
                {
                    using (var content = response.Content)
                    {
                        responseContent = await content.ReadFromJsonAsync<RoomInfo>();
                        HttpContext.Session.SetString("token", responseContent?.User?.Token ?? string.Empty);
                        HttpContext.Session.SetString("sessionRoom", JsonConvert.SerializeObject(responseContent));
                    }
                }
            }
            ViewBag.API = new { API = _configuration.GetValue<string>("APIUrl") };

            if (responseContent == null)
                return RedirectToAction("Index", "Stranger");

            return View(responseContent);
        }

        public async Task<IActionResult> Matching(JoinStrangerModel obj)
        {
            if (obj.RoomId == Guid.Empty)
                return RedirectToAction("Index", "Stranger");
            using (var client = _httpClientFactory.CreateClient("API"))
            {
                var model = obj;
                var response = await client.PostAsJsonAsync("/api/Stranger/join-stranger", model);
                if (response.IsSuccessStatusCode)
                {
                    using (var content = response.Content)
                    {
                        var responseContent = await content.ReadFromJsonAsync<RoomInfo>();
                        HttpContext.Session.SetString("token", responseContent?.User?.Token ?? string.Empty);
                        HttpContext.Session.SetString("sessionRoom", JsonConvert.SerializeObject(responseContent));
                        return RedirectToAction("Meeting", "Home", new { id = responseContent?.Room?.RoomId });
                    }
                }
            }
            ViewBag.Error = "Room not found";
            return View();
        }

        public IActionResult Success()
        {
            return View();
        }

        public IActionResult Meeting2Peer()
        {
            return View();
        }
    }
}
