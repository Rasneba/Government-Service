using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Dashboard;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetDashboardAsync(int userId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new KeyNotFoundException("User not found");

            var query = _context.Letters.Where(l => !l.IsDeleted);

            var totalLetters = await query.CountAsync();
            var incomingToday = await query.CountAsync(l => l.IsIncoming && l.CreatedAt >= today && l.CreatedAt < tomorrow);
            var outgoingToday = await query.CountAsync(l => !l.IsIncoming && l.CreatedAt >= today && l.CreatedAt < tomorrow);
            var pendingLetters = await query.CountAsync(l => l.Status == Models.Enums.LetterStatus.Draft || l.Status == Models.Enums.LetterStatus.Submitted);
            var overdueLetters = await query.CountAsync(l => l.DueDate != null && l.DueDate < today && l.Status != Models.Enums.LetterStatus.Closed && l.Status != Models.Enums.LetterStatus.Received);

            var recentlyReceived = await query
                .Where(l => l.ReceiverId == userId || l.ReceiverDepartmentId == user.DepartmentId)
                .OrderByDescending(l => l.CreatedAt)
                .Take(5)
                .Select(l => new RecentLetterDto
                {
                    Id = l.Id,
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    SenderName = l.Sender.FullName,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();

            var recentlySent = await query
                .Where(l => l.SenderId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .Take(5)
                .Select(l => new RecentLetterDto
                {
                    Id = l.Id,
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    SenderName = l.Sender.FullName,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    CreatedAt = l.CreatedAt
                })
                .ToListAsync();

            var departmentStats = await _context.Departments
                .Select(d => new DepartmentStatsDto
                {
                    DepartmentName = d.Name,
                    TotalLetters = query.Count(l => l.SenderDepartmentId == d.Id || l.ReceiverDepartmentId == d.Id),
                    PendingLetters = query.Count(l => (l.SenderDepartmentId == d.Id || l.ReceiverDepartmentId == d.Id) && (l.Status == Models.Enums.LetterStatus.Draft || l.Status == Models.Enums.LetterStatus.Submitted)),
                    CompletedLetters = query.Count(l => (l.SenderDepartmentId == d.Id || l.ReceiverDepartmentId == d.Id) && l.Status == Models.Enums.LetterStatus.Closed)
                })
                .ToListAsync();

            var recentActivities = await _context.LetterMovements
                .Include(m => m.FromUser)
                .Include(m => m.Letter)
                .OrderByDescending(m => m.CreatedAt)
                .Take(10)
                .Select(m => new ActivityDto
                {
                    Action = m.Action,
                    UserName = m.FromUser.FullName,
                    Details = m.Letter.Subject,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return new DashboardDto
            {
                TotalLetters = totalLetters,
                IncomingToday = incomingToday,
                OutgoingToday = outgoingToday,
                PendingLetters = pendingLetters,
                OverdueLetters = overdueLetters,
                RecentlyReceived = recentlyReceived,
                RecentlySent = recentlySent,
                DepartmentStats = departmentStats,
                RecentActivities = recentActivities
            };
        }
    }
}
