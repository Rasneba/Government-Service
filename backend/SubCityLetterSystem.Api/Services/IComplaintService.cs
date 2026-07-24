using SubCityLetterSystem.Api.DTOs.Complaints;

namespace SubCityLetterSystem.Api.Services
{
    public interface IComplaintService
    {
        Task<List<ComplaintDto>> GetComplaintsByCitizenAsync(int citizenId);
        Task<ComplaintDto?> GetComplaintByIdAsync(int id);
        Task<ComplaintDto> CreateComplaintAsync(CreateComplaintDto dto, int citizenId);
        Task<ComplaintDto> AddCommentAsync(int complaintId, AddComplaintCommentDto dto, int? citizenId, int? userId);
        Task<List<ComplaintDto>> GetAllComplaintsAsync(string? status, int page, int pageSize);
    }
}
