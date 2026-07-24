using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Reports;
using SubCityLetterSystem.Api.Services;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _service;

        public ReportsController(IReportService service)
        {
            _service = service;
        }

        [HttpGet("letters")]
        public async Task<ActionResult<ApiResponse<PagedResult<LetterReportDto>>>> GetLetterReport(
            [FromQuery] ReportFilterDto filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _service.GetLetterReportAsync(filter, page, pageSize);
            return Ok(ApiResponse<PagedResult<LetterReportDto>>.Ok(result));
        }

        [HttpGet("monthly")]
        public async Task<ActionResult<ApiResponse<List<MonthlyReportDto>>>> GetMonthlyReport(
            [FromQuery] int year, [FromQuery] int? organizationId = null)
        {
            var result = await _service.GetMonthlyReportAsync(year, organizationId);
            return Ok(ApiResponse<List<MonthlyReportDto>>.Ok(result));
        }

        [HttpGet("department-performance")]
        public async Task<ActionResult<ApiResponse<List<DepartmentPerformanceDto>>>> GetDepartmentPerformance(
            [FromQuery] ReportFilterDto filter)
        {
            var result = await _service.GetDepartmentPerformanceAsync(filter);
            return Ok(ApiResponse<List<DepartmentPerformanceDto>>.Ok(result));
        }
    }
}
