using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Applications;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PoliceController : ControllerBase
    {
        private readonly IPoliceService _service;

        public PoliceController(IPoliceService service) { _service = service; }

        [HttpGet("pending")]
        public async Task<ActionResult<ApiResponse<PagedResult<ApplicationListDto>>>> GetPendingVerifications(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _service.GetPendingVerificationsAsync(null, page, pageSize);
            return Ok(ApiResponse<PagedResult<ApplicationListDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> GetApplicationForReview(int id)
        {
            var result = await _service.GetApplicationForReviewAsync(id);
            if (result == null) return NotFound(ApiResponse<ApplicationDetailDto>.Fail("Application not found"));
            return Ok(ApiResponse<ApplicationDetailDto>.Ok(result));
        }

        [HttpPost("{id}/review")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> ReviewApplication(int id, [FromBody] PoliceReviewDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _service.ReviewApplicationAsync(id, userId, dto);
                return Ok(ApiResponse<ApplicationDetailDto>.Ok(result, dto.Approved ? "Application approved" : "Application rejected"));
            }
            catch (KeyNotFoundException ex) { return NotFound(ApiResponse<ApplicationDetailDto>.Fail(ex.Message)); }
            catch (InvalidOperationException ex) { return BadRequest(ApiResponse<ApplicationDetailDto>.Fail(ex.Message)); }
        }

        [HttpGet("reviewed")]
        public async Task<ActionResult<ApiResponse<List<ApplicationListDto>>>> GetMyReviewed(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetMyReviewedApplicationsAsync(userId, page, pageSize);
            return Ok(ApiResponse<List<ApplicationListDto>>.Ok(result));
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ApiResponse<PoliceStatsDto>>> GetStats()
        {
            var result = await _service.GetPoliceStatsAsync();
            return Ok(ApiResponse<PoliceStatsDto>.Ok(result));
        }
    }
}
