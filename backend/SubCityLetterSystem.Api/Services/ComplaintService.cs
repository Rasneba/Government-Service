using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Complaints;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class ComplaintService : IComplaintService
    {
        private readonly AppDbContext _context;
        public ComplaintService(AppDbContext context) { _context = context; }

        public async Task<List<ComplaintDto>> GetComplaintsByCitizenAsync(int citizenId)
        {
            return await _context.Complaints
                .Where(c => c.CitizenId == citizenId && !c.IsDeleted)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id, Subject = c.Subject, Description = c.Description,
                    Category = c.Category, Priority = c.Priority, Status = c.Status,
                    Resolution = c.Resolution, CreatedAt = c.CreatedAt, ResolvedAt = c.ResolvedAt,
                    AssignedTo = c.AssignedToUser != null ? c.AssignedToUser.FullName : null,
                    Comments = c.Comments.OrderByDescending(cm => cm.CreatedAt).Select(cm => new ComplaintCommentDto
                    {
                        Id = cm.Id, Comment = cm.Comment, IsStaff = cm.UserId != null,
                        AuthorName = cm.User != null ? cm.User.FullName : "Citizen",
                        CreatedAt = cm.CreatedAt
                    }).ToList()
                }).ToListAsync();
        }

        public async Task<ComplaintDto?> GetComplaintByIdAsync(int id)
        {
            return await _context.Complaints
                .Where(c => c.Id == id && !c.IsDeleted)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id, Subject = c.Subject, Description = c.Description,
                    Category = c.Category, Priority = c.Priority, Status = c.Status,
                    Resolution = c.Resolution, CreatedAt = c.CreatedAt, ResolvedAt = c.ResolvedAt,
                    AssignedTo = c.AssignedToUser != null ? c.AssignedToUser.FullName : null,
                    Comments = c.Comments.OrderByDescending(cm => cm.CreatedAt).Select(cm => new ComplaintCommentDto
                    {
                        Id = cm.Id, Comment = cm.Comment, IsStaff = cm.UserId != null,
                        AuthorName = cm.User != null ? cm.User.FullName : "Citizen",
                        CreatedAt = cm.CreatedAt
                    }).ToList()
                }).FirstOrDefaultAsync();
        }

        public async Task<ComplaintDto> CreateComplaintAsync(CreateComplaintDto dto, int citizenId)
        {
            var complaint = new Complaint
            {
                CitizenId = citizenId, Subject = dto.Subject, Description = dto.Description,
                Category = dto.Category, Priority = dto.Priority, Status = "Open",
                CreatedAt = DateTime.UtcNow
            };
            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();
            return (await GetComplaintByIdAsync(complaint.Id))!;
        }

        public async Task<ComplaintDto> AddCommentAsync(int complaintId, AddComplaintCommentDto dto, int? citizenId, int? userId)
        {
            var comment = new ComplaintComment
            {
                ComplaintId = complaintId, CitizenId = citizenId, UserId = userId,
                Comment = dto.Comment, CreatedAt = DateTime.UtcNow
            };
            _context.ComplaintComments.Add(comment);
            await _context.SaveChangesAsync();
            return (await GetComplaintByIdAsync(complaintId))!;
        }

        public async Task<List<ComplaintDto>> GetAllComplaintsAsync(string? status, int page, int pageSize)
        {
            var query = _context.Complaints.Where(c => !c.IsDeleted).AsQueryable();
            if (!string.IsNullOrEmpty(status)) query = query.Where(c => c.Status == status);

            return await query.OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(c => new ComplaintDto
                {
                    Id = c.Id, Subject = c.Subject, Description = c.Description,
                    Category = c.Category, Priority = c.Priority, Status = c.Status,
                    CreatedAt = c.CreatedAt, ResolvedAt = c.ResolvedAt,
                    AssignedTo = c.AssignedToUser != null ? c.AssignedToUser.FullName : null
                }).ToListAsync();
        }
    }
}
