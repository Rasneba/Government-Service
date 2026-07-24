using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Letters;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LettersController : ControllerBase
    {
        private readonly ILetterService _letterService;

        public LettersController(ILetterService letterService)
        {
            _letterService = letterService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<LetterListDto>>>> GetLetters([FromQuery] LetterSearchDto search)
        {
            var result = await _letterService.GetLettersAsync(search);
            return Ok(ApiResponse<PagedResult<LetterListDto>>.Ok(result));
        }

        [HttpGet("inbox")]
        public async Task<ActionResult<ApiResponse<PagedResult<LetterListDto>>>> GetInbox([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _letterService.GetInboxAsync(userId, page, pageSize);
            return Ok(ApiResponse<PagedResult<LetterListDto>>.Ok(result));
        }

        [HttpGet("outbox")]
        public async Task<ActionResult<ApiResponse<PagedResult<LetterListDto>>>> GetOutbox([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _letterService.GetOutboxAsync(userId, page, pageSize);
            return Ok(ApiResponse<PagedResult<LetterListDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<LetterDetailDto>>> GetLetter(int id)
        {
            var letter = await _letterService.GetLetterByIdAsync(id);
            if (letter == null)
                return NotFound(ApiResponse<LetterDetailDto>.Fail("Letter not found"));
            return Ok(ApiResponse<LetterDetailDto>.Ok(letter));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<LetterDetailDto>>> CreateLetter([FromBody] CreateLetterDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _letterService.CreateLetterAsync(dto, userId);
                return CreatedAtAction(nameof(GetLetter), new { id = result.Id }, ApiResponse<LetterDetailDto>.Ok(result, "Letter created"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<LetterDetailDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<ApiResponse<LetterDetailDto>>> UpdateStatus(int id, [FromBody] UpdateLetterStatusDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _letterService.UpdateLetterStatusAsync(id, dto, userId);
                return Ok(ApiResponse<LetterDetailDto>.Ok(result, $"Letter status updated to {dto.Status}"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<LetterDetailDto>.Fail(ex.Message));
            }
        }

        [HttpPost("{id}/comments")]
        public async Task<ActionResult<ApiResponse<LetterDetailDto>>> AddComment(int id, [FromBody] AddCommentDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _letterService.AddCommentAsync(id, dto, userId);
                return Ok(ApiResponse<LetterDetailDto>.Ok(result, "Comment added"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<LetterDetailDto>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteLetter(int id)
        {
            var result = await _letterService.DeleteLetterAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Letter not found"));
            return Ok(ApiResponse<bool>.Ok(result, "Letter deleted"));
        }

        [HttpGet("generate-number")]
        public async Task<ActionResult<ApiResponse<string>>> GenerateNumber([FromQuery] bool isIncoming = true)
        {
            var number = await _letterService.GenerateLetterNumberAsync(isIncoming);
            return Ok(ApiResponse<string>.Ok(number));
        }
    }
}
