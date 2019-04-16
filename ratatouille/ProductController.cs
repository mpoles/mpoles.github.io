using Aggregator.Core.Data.Context;
using Aggregator.Core.Data.Enums;
using Aggregator.Core.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Aggregator.Core.Controllers
{
    [Route("products")]
    public class ProductController : Controller
    {
        private readonly AggregatorContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        public ProductController(AggregatorContext dbContext, UserManager<User> userManager, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _configuration = configuration;
        }
        [HttpGet("{Id}/buy")]
        [Authorize]
        public ActionResult Buy(int Id)
        {
            var productinfo = _dbContext.Events.AsQueryable().FirstOrDefault(x => x.Id == Id);
            return View("~/Views/Product/ProductBuy.cshtml", productinfo);
        }
        [HttpGet("{Id}/robokassa")]
        [Authorize]
        public async Task<IActionResult> PayWithROBOKASSAAsync(int Id)
        {
            var userId = (await _userManager.GetUserAsync(User))?.Id;
            if (userId == null)
                return NotFound();
            var Model =
                _dbContext.Events.AsQueryable().Include(x=>x.Orders).FirstOrDefault(x => x.Id == Id);
            if (Model == null)
                return NotFound();
            var existingOrder = Model.Orders.FirstOrDefault(x => x.UserId == userId && x.Status == OrderStatus.Stated);
            if (existingOrder == null)
            {
                existingOrder = new Order
                {
                    Event = Model,
                    UserId = userId,
                    Status = OrderStatus.Stated
                };
                _dbContext.Orders.Add(existingOrder);
                _dbContext.SaveChanges();
            }
            return Redirect(GenerateTestPaymentReference(Model.Price, existingOrder.Id));
        }
        private string CalculateMD5Hash(string value)
        {
            MD5 md5 = MD5.Create();
            byte[] inputBytes = Encoding.ASCII.GetBytes(value);
            byte[] hash = md5.ComputeHash(inputBytes);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
                sb.Append(hash[i].ToString("x2"));
            return sb.ToString();
        }
        private string GeneratePaymentReference(int OutSum, int InvId)
        {
            var settings = _configuration.GetSection("robokassa");
            var URL = settings["URL"];
            var Password1 = settings["Password1"];
            var MerchantLogin = settings["MerchantLogin"];
            var SignatureValue = CalculateMD5Hash($"{MerchantLogin}:{OutSum}:{InvId}:{Password1}");
            return $"{URL}?MerchantLogin={MerchantLogin}&OutSum={OutSum}&InvId={InvId}&SignatureValue={SignatureValue}";
        }
        private string GenerateTestPaymentReference(int OutSum, int InvId)
        {
            var settings = _configuration.GetSection("robokassa");
            var URL = settings["URL"];
            var Password1 = settings["TestPassword1"];
            var Password2 = settings["TestPassword2"];
            var MerchantLogin = settings["MerchantLogin"];
            var SignatureValue = CalculateMD5Hash($"{MerchantLogin}:{OutSum}:{InvId}:{Password1}");
            return $"{URL}?MerchantLogin={MerchantLogin}&OutSum={OutSum}&InvId={InvId}&SignatureValue={SignatureValue}&IsTest=1";
        }
    }
}