using SubCityLetterSystem.Api.DTOs.Applications;
using SubCityLetterSystem.Api.DTOs.Common;

namespace SubCityLetterSystem.Api.Services
{
    public interface IApplicationService
    {
        Task<PagedResult<ApplicationListDto>> GetApplicationsAsync(int? citizenId, int? officerId, string? status, int? serviceTypeId, int page, int pageSize);
        Task<ApplicationDetailDto?> GetApplicationByIdAsync(int id);
        Task<ApplicationDetailDto> CreateApplicationAsync(CreateApplicationDto dto, int citizenId);
        Task<ApplicationDetailDto> AdvanceStepAsync(int applicationId, int userId, string? notes);
        Task<ApplicationDetailDto> RejectStepAsync(int applicationId, int userId, string reason);
        Task<ApplicationDetailDto> AssignOfficerAsync(int applicationId, int officerId);
        Task<ApplicationDetailDto> AddNoteAsync(int applicationId, AddNoteDto dto, int? userId, int? citizenId);
        Task<string> GenerateApplicationNumberAsync(int serviceTypeId);
    }
}
