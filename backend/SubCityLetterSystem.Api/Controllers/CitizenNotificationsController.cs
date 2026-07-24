using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Notifications;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/citizen/Notifications")]
    [Authorize]
    public class CitizenNotificationsController : ControllerBase
    {
        private readonly ICitizenNotificationService _service;
        public CitizenNotificationsController(ICitizenNotificationService service) { _service = service; }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CitizenNotificationDto>>>> GetNotifications([FromQuery] bool? unreadOnly)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetNotificationsAsync(citizenId, unreadOnly);
            return Ok(ApiResponse<List<CitizenNotificationDto>>.Ok(result));
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var count = await _service.GetUnreadCountAsync(citizenId);
            return Ok(ApiResponse<int>.Ok(count));
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _service.MarkAsReadAsync(id, citizenId);
            return Ok();
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _service.MarkAllAsReadAsync(citizenId);
            return Ok();
        }
    }
}
