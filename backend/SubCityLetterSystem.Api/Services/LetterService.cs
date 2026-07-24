using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Letters;
using SubCityLetterSystem.Api.Models.Entities;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Services
{
    public class LetterService : ILetterService
    {
        private readonly AppDbContext _context;

        public LetterService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<LetterListDto>> GetLettersAsync(LetterSearchDto search)
        {
            var query = _context.Letters
                .Include(l => l.Sender)
                .Include(l => l.Receiver)
                .Include(l => l.SenderDepartment)
                .Include(l => l.ReceiverDepartment)
                .Where(l => !l.IsDeleted)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search.LetterNumber))
                query = query.Where(l => l.LetterNumber.Contains(search.LetterNumber));
            if (!string.IsNullOrEmpty(search.Subject))
                query = query.Where(l => l.Subject.Contains(search.Subject));
            if (!string.IsNullOrEmpty(search.SenderName))
                query = query.Where(l => l.Sender.FullName.Contains(search.SenderName));
            if (!string.IsNullOrEmpty(search.ReceiverName))
                query = query.Where(l => l.Receiver != null && l.Receiver.FullName.Contains(search.ReceiverName));
            if (!string.IsNullOrEmpty(search.CitizenName))
                query = query.Where(l => l.CitizenName != null && l.CitizenName.Contains(search.CitizenName));
            if (!string.IsNullOrEmpty(search.CaseNumber))
                query = query.Where(l => l.CaseNumber != null && l.CaseNumber.Contains(search.CaseNumber));
            if (search.DateFrom.HasValue)
                query = query.Where(l => l.CreatedAt >= search.DateFrom.Value);
            if (search.DateTo.HasValue)
                query = query.Where(l => l.CreatedAt <= search.DateTo.Value);
            if (!string.IsNullOrEmpty(search.Status) && Enum.TryParse<Models.Enums.LetterStatus>(search.Status, out var status))
                query = query.Where(l => l.Status == status);
            if (!string.IsNullOrEmpty(search.Priority) && Enum.TryParse<LetterPriority>(search.Priority, out var priority))
                query = query.Where(l => l.Priority == priority);
            if (search.DepartmentId.HasValue)
                query = query.Where(l => l.SenderDepartmentId == search.DepartmentId || l.ReceiverDepartmentId == search.DepartmentId);
            if (search.IsIncoming.HasValue)
                query = query.Where(l => l.IsIncoming == search.IsIncoming.Value);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(l => l.CreatedAt)
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .Select(l => new LetterListDto
                {
                    Id = l.Id,
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    SenderName = l.Sender.FullName,
                    ReceiverName = l.Receiver != null ? l.Receiver.FullName : null,
                    SenderDepartment = l.SenderDepartment != null ? l.SenderDepartment.Name : null,
                    ReceiverDepartment = l.ReceiverDepartment != null ? l.ReceiverDepartment.Name : null,
                    IsIncoming = l.IsIncoming,
                    CreatedAt = l.CreatedAt,
                    DueDate = l.DueDate
                })
                .ToListAsync();

            return new PagedResult<LetterListDto> { Items = items, TotalCount = total, Page = search.Page, PageSize = search.PageSize };
        }

        public async Task<LetterDetailDto?> GetLetterByIdAsync(int id)
        {
            return await _context.Letters
                .Include(l => l.Sender)
                .Include(l => l.Receiver)
                .Include(l => l.SenderDepartment)
                .Include(l => l.ReceiverDepartment)
                .Include(l => l.CreatedBy)
                .Include(l => l.ApprovedBy)
                .Include(l => l.Attachments).ThenInclude(a => a.UploadedBy)
                .Include(l => l.Movements).ThenInclude(m => m.FromUser)
                .Include(l => l.Movements).ThenInclude(m => m.ToUser)
                .Include(l => l.Comments).ThenInclude(c => c.User)
                .Where(l => !l.IsDeleted && l.Id == id)
                .Select(l => new LetterDetailDto
                {
                    Id = l.Id,
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    Body = l.Body,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    SenderId = l.SenderId,
                    SenderName = l.Sender.FullName,
                    ReceiverId = l.ReceiverId,
                    ReceiverName = l.Receiver != null ? l.Receiver.FullName : null,
                    SenderDepartmentId = l.SenderDepartmentId,
                    SenderDepartment = l.SenderDepartment != null ? l.SenderDepartment.Name : null,
                    ReceiverDepartmentId = l.ReceiverDepartmentId,
                    ReceiverDepartment = l.ReceiverDepartment != null ? l.ReceiverDepartment.Name : null,
                    CitizenName = l.CitizenName,
                    CaseNumber = l.CaseNumber,
                    DueDate = l.DueDate,
                    CreatedAt = l.CreatedAt,
                    SentAt = l.SentAt,
                    ReceivedAt = l.ReceivedAt,
                    ClosedAt = l.ClosedAt,
                    RejectionReason = l.RejectionReason,
                    IsIncoming = l.IsIncoming,
                    CreatedById = l.CreatedById,
                    CreatedByName = l.CreatedBy.FullName,
                    Attachments = l.Attachments.Select(a => new AttachmentDto
                    {
                        Id = a.Id,
                        FileName = a.FileName,
                        ContentType = a.ContentType,
                        FileSize = a.FileSize,
                        UploadedAt = a.UploadedAt,
                        UploadedByName = a.UploadedBy.FullName
                    }).ToList(),
                    Movements = l.Movements.OrderBy(m => m.CreatedAt).Select(m => new MovementDto
                    {
                        Id = m.Id,
                        FromUserName = m.FromUser.FullName,
                        ToUserName = m.ToUser != null ? m.ToUser.FullName : null,
                        Action = m.Action,
                        Notes = m.Notes,
                        CreatedAt = m.CreatedAt
                    }).ToList(),
                    Comments = l.Comments.OrderByDescending(c => c.CreatedAt).Select(c => new CommentDto
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        UserName = c.User.FullName,
                        Comment = c.Comment,
                        CreatedAt = c.CreatedAt
                    }).ToList()
                })
                .FirstOrDefaultAsync();
        }

        public async Task<LetterDetailDto> CreateLetterAsync(CreateLetterDto dto, int userId)
        {
            var letterNumber = await GenerateLetterNumberAsync(dto.IsIncoming);

            var letter = new Letter
            {
                LetterNumber = letterNumber,
                Subject = dto.Subject,
                Body = dto.Body,
                Priority = Enum.Parse<LetterPriority>(dto.Priority),
                Status = Models.Enums.LetterStatus.Draft,
                SenderId = userId,
                ReceiverId = dto.ReceiverId,
                ReceiverDepartmentId = dto.ReceiverDepartmentId,
                CitizenName = dto.CitizenName,
                CaseNumber = dto.CaseNumber,
                DueDate = dto.DueDate,
                IsIncoming = dto.IsIncoming,
                CreatedById = userId,
                CreatedAt = DateTime.UtcNow
            };

            var user = await _context.Users.Include(u => u.Department).FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.DepartmentId != null)
                letter.SenderDepartmentId = user.DepartmentId;

            _context.Letters.Add(letter);

            _context.LetterMovements.Add(new LetterMovement
            {
                Letter = letter,
                FromUserId = userId,
                Action = dto.IsIncoming ? "Registered" : "Created",
                Notes = "Letter created",
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return (await GetLetterByIdAsync(letter.Id))!;
        }

        public async Task<LetterDetailDto> UpdateLetterStatusAsync(int id, UpdateLetterStatusDto dto, int userId)
        {
            var letter = await _context.Letters.FindAsync(id);
            if (letter == null) throw new KeyNotFoundException("Letter not found");

            var newStatus = Enum.Parse<Models.Enums.LetterStatus>(dto.Status);
            letter.Status = newStatus;

            if (newStatus == Models.Enums.LetterStatus.Approved)
                letter.ApprovedById = userId;
            else if (newStatus == Models.Enums.LetterStatus.Sent)
                letter.SentAt = DateTime.UtcNow;
            else if (newStatus == Models.Enums.LetterStatus.Received)
                letter.ReceivedAt = DateTime.UtcNow;
            else if (newStatus == Models.Enums.LetterStatus.Closed)
                letter.ClosedAt = DateTime.UtcNow;
            else if (newStatus == Models.Enums.LetterStatus.Rejected)
                letter.RejectionReason = dto.RejectionReason;

            _context.LetterMovements.Add(new LetterMovement
            {
                LetterId = id,
                FromUserId = userId,
                ToUserId = letter.ReceiverId,
                Action = dto.Status,
                Notes = dto.Notes ?? $"Status changed to {dto.Status}",
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return (await GetLetterByIdAsync(id))!;
        }

        public async Task<LetterDetailDto> AddCommentAsync(int letterId, AddCommentDto dto, int userId)
        {
            var letter = await _context.Letters.FindAsync(letterId);
            if (letter == null) throw new KeyNotFoundException("Letter not found");

            var comment = new LetterComment
            {
                LetterId = letterId,
                UserId = userId,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.LetterComments.Add(comment);
            await _context.SaveChangesAsync();
            return (await GetLetterByIdAsync(letterId))!;
        }

        public async Task<bool> DeleteLetterAsync(int id)
        {
            var letter = await _context.Letters.FindAsync(id);
            if (letter == null) return false;
            letter.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> GenerateLetterNumberAsync(bool isIncoming)
        {
            var prefix = isIncoming ? "IN" : "OUT";
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var count = await _context.Letters
                .Where(l => l.LetterNumber.StartsWith($"{prefix}-{datePart}"))
                .CountAsync();
            return $"{prefix}-{datePart}-{(count + 1):D4}";
        }

        public async Task<PagedResult<LetterListDto>> GetInboxAsync(int userId, int page, int pageSize)
        {
            var search = new LetterSearchDto
            {
                ReceiverName = "",
                Page = page,
                PageSize = pageSize
            };

            var query = _context.Letters
                .Include(l => l.Sender)
                .Include(l => l.Receiver)
                .Include(l => l.SenderDepartment)
                .Include(l => l.ReceiverDepartment)
                .Where(l => !l.IsDeleted && (l.ReceiverId == userId || l.ReceiverDepartmentId == _context.Users.Where(u => u.Id == userId).Select(u => u.DepartmentId).FirstOrDefault()))
                .OrderByDescending(l => l.CreatedAt);

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
                .Select(l => new LetterListDto
                {
                    Id = l.Id,
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    SenderName = l.Sender.FullName,
                    ReceiverName = l.Receiver != null ? l.Receiver.FullName : null,
                    SenderDepartment = l.SenderDepartment != null ? l.SenderDepartment.Name : null,
                    ReceiverDepartment = l.ReceiverDepartment != null ? l.ReceiverDepartment.Name : null,
                    IsIncoming = l.IsIncoming,
                    CreatedAt = l.CreatedAt,
                    DueDate = l.DueDate
                })
                .ToListAsync();

            return new PagedResult<LetterListDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<PagedResult<LetterListDto>> GetOutboxAsync(int userId, int page, int pageSize)
        {
            var query = _context.Letters
                .Include(l => l.Sender)
                .Include(l => l.Receiver)
                .Include(l => l.SenderDepartment)
                .Include(l => l.ReceiverDepartment)
                .Where(l => !l.IsDeleted && l.SenderId == userId)
                .OrderByDescending(l => l.CreatedAt);

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize)
                .Select(l => new LetterListDto
                {
                    Id = l.Id,
                    LetterNumber = l.LetterNumber,
                    Subject = l.Subject,
                    Priority = l.Priority.ToString(),
                    Status = l.Status.ToString(),
                    SenderName = l.Sender.FullName,
                    ReceiverName = l.Receiver != null ? l.Receiver.FullName : null,
                    SenderDepartment = l.SenderDepartment != null ? l.SenderDepartment.Name : null,
                    ReceiverDepartment = l.ReceiverDepartment != null ? l.ReceiverDepartment.Name : null,
                    IsIncoming = l.IsIncoming,
                    CreatedAt = l.CreatedAt,
                    DueDate = l.DueDate
                })
                .ToListAsync();

            return new PagedResult<LetterListDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }
    }
}
