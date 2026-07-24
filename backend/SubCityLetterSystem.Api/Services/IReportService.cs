using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Reports;

namespace SubCityLetterSystem.Api.Services
{
    public interface IReportService
    {
        Task<PagedResult<LetterReportDto>> GetLetterReportAsync(ReportFilterDto filter, int page, int pageSize);
        Task<List<MonthlyReportDto>> GetMonthlyReportAsync(int year, int? organizationId = null);
        Task<List<DepartmentPerformanceDto>> GetDepartmentPerformanceAsync(ReportFilterDto filter);
    }
}