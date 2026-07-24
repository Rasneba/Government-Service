using SubCityLetterSystem.Api.DTOs.Notifications;

namespace SubCityLetterSystem.Api.Services
{
    public interface ICitizenNotificationService
    {
        Task<List<CitizenNotificationDto>> GetNotificationsAsync(int citizenId, bool? unreadOnly);
        Task<int> GetUnreadCountAsync(int citizenId);
        Task MarkAsReadAsync(int notificationId, int citizenId);
        Task MarkAllAsReadAsync(int citizenId);
    }
}
