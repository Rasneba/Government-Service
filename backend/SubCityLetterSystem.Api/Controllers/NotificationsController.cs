using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Notifications;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationsController(INotificationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<NotificationDto>>>> GetNotifications([FromQuery] bool unreadOnly = false)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetUserNotificationsAsync(userId, unreadOnly);
            return Ok(ApiResponse<List<NotificationDto>>.Ok(result));
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<ApiResponse<NotificationCountDto>>> GetUnreadCount()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetUnreadCountAsync(userId);
            return Ok(ApiResponse<NotificationCountDto>.Ok(result));
        }

        [HttpPut("{id}/read")]
        public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(int id)
        {
            var result = await _service.MarkAsReadAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Notification not found"));
            return Ok(ApiResponse<bool>.Ok(result));
        }

        [HttpPut("read-all")]
        public async Task<ActionResult<ApiResponse<bool>>> MarkAllAsRead()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.MarkAllAsReadAsync(userId);
            return Ok(ApiResponse<bool>.Ok(result));
        }
    }
}
