using SubCityLetterSystem.Api.DTOs.Applications;
using SubCityLetterSystem.Api.DTOs.Common;

namespace SubCityLetterSystem.Api.Services
{
    public interface IPoliceService
    {
        Task<PagedResult<ApplicationListDto>> GetPendingVerificationsAsync(int? userId, int page, int pageSize);
        Task<ApplicationDetailDto?> GetApplicationForReviewAsync(int id);
        Task<ApplicationDetailDto> ReviewApplicationAsync(int applicationId, int userId, PoliceReviewDto dto);
        Task<List<ApplicationListDto>> GetMyReviewedApplicationsAsync(int userId, int page, int pageSize);
        Task<PoliceStatsDto> GetPoliceStatsAsync();
    }

    public class PoliceStatsDto
    {
        public int PendingVerifications { get; set; }
        public int ApprovedToday { get; set; }
        public int RejectedToday { get; set; }
        public int TotalReviewed { get; set; }
    }
}
