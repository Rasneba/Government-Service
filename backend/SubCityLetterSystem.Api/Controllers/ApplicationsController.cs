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
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _service;

        public ApplicationsController(IApplicationService service) { _service = service; }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<ApplicationListDto>>>> GetApplications(
            [FromQuery] int? citizenId, [FromQuery] int? officerId, [FromQuery] string? status,
            [FromQuery] int? serviceTypeId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _service.GetApplicationsAsync(citizenId, officerId, status, serviceTypeId, page, pageSize);
            return Ok(ApiResponse<PagedResult<ApplicationListDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> GetApplication(int id)
        {
            var result = await _service.GetApplicationByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<ApplicationDetailDto>.Fail("Application not found"));
            return Ok(ApiResponse<ApplicationDetailDto>.Ok(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> CreateApplication([FromBody] CreateApplicationDto dto)
        {
            try
            {
                var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _service.CreateApplicationAsync(dto, citizenId);
                return Ok(ApiResponse<ApplicationDetailDto>.Ok(result, "Application created"));
            }
            catch (Exception ex) { return BadRequest(ApiResponse<ApplicationDetailDto>.Fail(ex.Message)); }
        }

        [HttpPut("{id}/advance")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> AdvanceStep(int id, [FromBody] AddNoteDto? dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _service.AdvanceStepAsync(id, userId, dto?.Note);
                return Ok(ApiResponse<ApplicationDetailDto>.Ok(result, "Step advanced"));
            }
            catch (Exception ex) { return BadRequest(ApiResponse<ApplicationDetailDto>.Fail(ex.Message)); }
        }

        [HttpPut("{id}/reject")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> RejectStep(int id, [FromBody] AddNoteDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _service.RejectStepAsync(id, userId, dto.Note);
                return Ok(ApiResponse<ApplicationDetailDto>.Ok(result, "Step rejected"));
            }
            catch (Exception ex) { return BadRequest(ApiResponse<ApplicationDetailDto>.Fail(ex.Message)); }
        }

        [HttpPut("{id}/assign/{officerId}")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> AssignOfficer(int id, int officerId)
        {
            var result = await _service.AssignOfficerAsync(id, officerId);
            return Ok(ApiResponse<ApplicationDetailDto>.Ok(result, "Officer assigned"));
        }

        [HttpPost("{id}/notes")]
        public async Task<ActionResult<ApiResponse<ApplicationDetailDto>>> AddNote(int id, [FromBody] AddNoteDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.AddNoteAsync(id, dto, userId, null);
            return Ok(ApiResponse<ApplicationDetailDto>.Ok(result, "Note added"));
        }
    }
}
