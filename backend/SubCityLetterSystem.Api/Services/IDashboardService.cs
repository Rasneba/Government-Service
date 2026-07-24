using SubCityLetterSystem.Api.DTOs.Dashboard;

namespace SubCityLetterSystem.Api.Services
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardAsync(int userId);
    }
}