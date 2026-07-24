using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Feedback;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbacksController : ControllerBase
    {
        private readonly IFeedbackService _service;
        public FeedbacksController(IFeedbackService service) { _service = service; }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<FeedbackDto>>>> GetMyFeedback()
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetFeedbackByCitizenAsync(citizenId);
            return Ok(ApiResponse<List<FeedbackDto>>.Ok(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<FeedbackDto>>> SubmitFeedback([FromBody] CreateFeedbackDto dto)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateFeedbackAsync(dto, citizenId);
            return Ok(ApiResponse<FeedbackDto>.Ok(result, "Feedback submitted"));
        }
    }
}
