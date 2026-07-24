using SubCityLetterSystem.Api.DTOs.Notifications;

namespace SubCityLetterSystem.Api.Services
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetUserNotificationsAsync(int userId, bool unreadOnly = false);
        Task<NotificationCountDto> GetUnreadCountAsync(int userId);
        Task<bool> MarkAsReadAsync(int notificationId);
        Task<bool> MarkAllAsReadAsync(int userId);
        Task CreateNotificationAsync(int userId, string title, string? message, int? referenceId = null, string? referenceType = null);
    }
}