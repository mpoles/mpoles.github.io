using Aggregator.Core.Controllers;
using Aggregator.Core.Data.Context;
using Aggregator.Core.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;
using System.Net;
using Microsoft.EntityFrameworkCore;

namespace Tests
{
    public class Tests
    {
        [Test]
        public void ProductController_PayWithROBOKASSAAsync_ShouldReturnNotFound()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<AggregatorContext>()
                .UseInMemoryDatabase(databaseName: "Add_writes_to_database")
                .Options;
            var context = new AggregatorContext(options);
            var store = Substitute.For<IUserStore<User>>();
            var controller = new ProductController(context,
                Substitute.For<UserManager<User>>(store, null, null, null, null, null, null, null, null),
                Substitute.For<IConfiguration>());
            //Act
            var result = controller.PayWithROBOKASSAAsync(-1).Result as StatusCodeResult;
            //Assert
            Assert.AreEqual(result.StatusCode, (int)HttpStatusCode.NotFound);
        }
    }
}