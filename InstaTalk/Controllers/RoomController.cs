using Microsoft.AspNetCore.Mvc;

namespace InstaTalk.Controllers
{
    public class RoomController : Controller
    {
        public IActionResult Index(int id)
        {
            if (id == 1)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        public IActionResult Meeting()
        {
            return View();
        }
    }
}
