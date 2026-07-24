using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Reports;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<LetterReportDto>> GetLetterReportAsync(ReportFilterDto filter, int page, int pageSize)
        {
            var query = _context.Letters
                .Include(l => l.Sender)
                .Include(l => l.Receiver)
                .Include(l => l.SenderDepartment)
                .Where(l => !l.IsDeleted)
                .AsQueryable();

            if (filter.DateFrom.HasValue)
                query = query.Where(l => l.CreatedAt >= filter.DateFrom.Value);
            if (filter.DateTo.HasValue)
                query = query.Where(l => l.CreatedAt <= filter.DateTo.Value);
            if (filter.DepartmentId.HasValue)
                query = query.Where(l => l.SenderDepartmentId == filter.DepartmentId || l.ReceiverDepartmentId == filter.DepartmentId);
            if (filter.OrganizationId.HasValue)
                query = query.Where(l => l.Sender.OrganizationId == filter.OrganizationId || (l.Receiver != null && l.Receiver.OrganizationId == filter.OrganizationId));

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new LetterReportDto
                {
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    SenderName = l.Sender.FullName,
                    ReceiverName = l.Receiver != null ? l.Receiver.FullName : null,
                    Department = l.SenderDepartment != null ? l.SenderDepartment.Name : "",
                    CreatedAt = l.CreatedAt,
                    DueDate = l.DueDate,
                    IsOverdue = l.DueDate != null && l.DueDate < DateTime.UtcNow && l.Status != Models.Enums.LetterStatus.Closed && l.Status != Models.Enums.LetterStatus.Received
                })
                .ToListAsync();

            return new PagedResult<LetterReportDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<List<MonthlyReportDto>> GetMonthlyReportAsync(int year, int? organizationId = null)
        {
            var query = _context.Letters.Where(l => !l.IsDeleted && l.CreatedAt.Year == year).AsQueryable();

            if (organizationId.HasValue)
                query = query.Where(l => l.Sender.OrganizationId == organizationId.Value);

            var monthlyData = await query
                .GroupBy(l => new { l.CreatedAt.Year, l.CreatedAt.Month })
                .Select(g => new MonthlyReportDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    MonthName = "",
                    Incoming = g.Count(l => l.IsIncoming),
                    Outgoing = g.Count(l => !l.IsIncoming),
                    Pending = g.Count(l => l.Status == Models.Enums.LetterStatus.Draft || l.Status == Models.Enums.LetterStatus.Submitted),
                    Completed = g.Count(l => l.Status == Models.Enums.LetterStatus.Closed)
                })
                .OrderBy(m => m.Month)
                .ToListAsync();

            var monthNames = new[] { "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
            foreach (var item in monthlyData)
                item.MonthName = monthNames[item.Month];

            return monthlyData;
        }

        public async Task<List<DepartmentPerformanceDto>> GetDepartmentPerformanceAsync(ReportFilterDto filter)
        {
            var query = _context.Letters.Where(l => !l.IsDeleted).AsQueryable();

            if (filter.DateFrom.HasValue)
                query = query.Where(l => l.CreatedAt >= filter.DateFrom.Value);
            if (filter.DateTo.HasValue)
                query = query.Where(l => l.CreatedAt <= filter.DateTo.Value);

            var departments = await _context.Departments.ToListAsync();
            var result = new List<DepartmentPerformanceDto>();

            foreach (var dept in departments)
            {
                var deptLetters = await query
                    .Where(l => l.SenderDepartmentId == dept.Id)
                    .ToListAsync();

                var completed = deptLetters.Count(l => l.Status == Models.Enums.LetterStatus.Closed);
                var pending = deptLetters.Count(l => l.Status == Models.Enums.LetterStatus.Draft || l.Status == Models.Enums.LetterStatus.Submitted);
                var overdue = deptLetters.Count(l => l.DueDate != null && l.DueDate < DateTime.UtcNow && l.Status != Models.Enums.LetterStatus.Closed && l.Status != Models.Enums.LetterStatus.Received);
                var avgDays = completed > 0 ? deptLetters.Where(l => l.ClosedAt.HasValue).Average(l => (l.ClosedAt!.Value - l.CreatedAt).TotalDays) : 0;

                result.Add(new DepartmentPerformanceDto
                {
                    DepartmentName = dept.Name,
                    TotalLetters = deptLetters.Count,
                    CompletedLetters = completed,
                    PendingLetters = pending,
                    OverdueLetters = overdue,
                    AvgCompletionDays = Math.Round(avgDays, 1),
                    PerformancePercentage = deptLetters.Count > 0 ? Math.Round((double)completed / deptLetters.Count * 100, 1) : 0
                });
            }

            return result;
        }
    }
}
