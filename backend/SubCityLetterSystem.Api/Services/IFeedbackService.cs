using SubCityLetterSystem.Api.DTOs.Feedback;

namespace SubCityLetterSystem.Api.Services
{
    public interface IFeedbackService
    {
        Task<List<FeedbackDto>> GetFeedbackByCitizenAsync(int citizenId);
        Task<FeedbackDto> CreateFeedbackAsync(CreateFeedbackDto dto, int citizenId);
        Task<List<FeedbackDto>> GetAllFeedbackAsync(int page, int pageSize);
    }
}
