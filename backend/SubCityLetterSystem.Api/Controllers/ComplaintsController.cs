using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Complaints;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _service;
        public ComplaintsController(IComplaintService service) { _service = service; }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ComplaintDto>>>> GetMyComplaints()
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetComplaintsByCitizenAsync(citizenId);
            return Ok(ApiResponse<List<ComplaintDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> GetComplaint(int id)
        {
            var result = await _service.GetComplaintByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<ComplaintDto>.Fail("Complaint not found"));
            return Ok(ApiResponse<ComplaintDto>.Ok(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> CreateComplaint([FromBody] CreateComplaintDto dto)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateComplaintAsync(dto, citizenId);
            return Ok(ApiResponse<ComplaintDto>.Ok(result, "Complaint submitted"));
        }

        [HttpPost("{id}/comments")]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> AddComment(int id, [FromBody] AddComplaintCommentDto dto)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.AddCommentAsync(id, dto, citizenId, null);
            return Ok(ApiResponse<ComplaintDto>.Ok(result, "Comment added"));
        }
    }
}
