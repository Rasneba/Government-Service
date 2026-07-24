using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Feedback;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly AppDbContext _context;
        public FeedbackService(AppDbContext context) { _context = context; }

        public async Task<List<FeedbackDto>> GetFeedbackByCitizenAsync(int citizenId)
        {
            return await _context.Feedbacks
                .Where(f => f.CitizenId == citizenId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new FeedbackDto
                {
                    Id = f.Id, CitizenId = f.CitizenId, CitizenName = f.Citizen.FullName,
                    ApplicationId = f.ApplicationId,
                    ApplicationNumber = f.Application != null ? f.Application.ApplicationNumber : null,
                    Type = f.Type, Rating = f.Rating, Subject = f.Subject, Message = f.Message,
                    IsPublic = f.IsPublic, CreatedAt = f.CreatedAt
                }).ToListAsync();
        }

        public async Task<FeedbackDto> CreateFeedbackAsync(CreateFeedbackDto dto, int citizenId)
        {
            var feedback = new Feedback
            {
                CitizenId = citizenId, ApplicationId = dto.ApplicationId, Type = dto.Type,
                Rating = dto.Rating, Subject = dto.Subject, Message = dto.Message,
                IsPublic = dto.IsPublic, CreatedAt = DateTime.UtcNow
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return (await _context.Feedbacks
                .Where(f => f.Id == feedback.Id)
                .Select(f => new FeedbackDto
                {
                    Id = f.Id, CitizenId = f.CitizenId, CitizenName = f.Citizen.FullName,
                    ApplicationId = f.ApplicationId, Type = f.Type, Rating = f.Rating,
                    Subject = f.Subject, Message = f.Message, IsPublic = f.IsPublic,
                    CreatedAt = f.CreatedAt
                }).FirstOrDefaultAsync())!;
        }

        public async Task<List<FeedbackDto>> GetAllFeedbackAsync(int page, int pageSize)
        {
            return await _context.Feedbacks
                .OrderByDescending(f => f.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(f => new FeedbackDto
                {
                    Id = f.Id, CitizenId = f.CitizenId, CitizenName = f.Citizen.FullName,
                    ApplicationId = f.ApplicationId, Type = f.Type, Rating = f.Rating,
                    Subject = f.Subject, Message = f.Message, IsPublic = f.IsPublic,
                    CreatedAt = f.CreatedAt
                }).ToListAsync();
        }
    }
}
