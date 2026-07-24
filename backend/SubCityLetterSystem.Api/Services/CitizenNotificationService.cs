using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Notifications;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class CitizenNotificationService : ICitizenNotificationService
    {
        private readonly AppDbContext _context;
        public CitizenNotificationService(AppDbContext context) { _context = context; }

        public async Task<List<CitizenNotificationDto>> GetNotificationsAsync(int citizenId, bool? unreadOnly)
        {
            var query = _context.SystemNotifications.Where(n => n.CitizenId == citizenId);
            if (unreadOnly == true) query = query.Where(n => !n.IsRead);

            return await query.OrderByDescending(n => n.CreatedAt)
                .Select(n => new CitizenNotificationDto
                {
                    Id = n.Id, Title = n.Title, Message = n.Message, Type = n.Type,
                    ApplicationId = n.ApplicationId, ReferenceType = n.ReferenceType,
                    ReferenceId = n.ReferenceId, IsRead = n.IsRead, CreatedAt = n.CreatedAt
                }).ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(int citizenId)
        {
            return await _context.SystemNotifications.CountAsync(n => n.CitizenId == citizenId && !n.IsRead);
        }

        public async Task MarkAsReadAsync(int notificationId, int citizenId)
        {
            var notification = await _context.SystemNotifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.CitizenId == citizenId);
            if (notification != null)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadAsync(int citizenId)
        {
            var unread = await _context.SystemNotifications
                .Where(n => n.CitizenId == citizenId && !n.IsRead)
                .ToListAsync();
            foreach (var n in unread) { n.IsRead = true; n.ReadAt = DateTime.UtcNow; }
            await _context.SaveChangesAsync();
        }
    }
}
