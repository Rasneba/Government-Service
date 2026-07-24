using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Dashboard;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<DashboardDto>>> GetDashboard()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetDashboardAsync(userId);
            return Ok(ApiResponse<DashboardDto>.Ok(result));
        }
    }
}
