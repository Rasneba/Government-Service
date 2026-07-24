using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Auth;
using SubCityLetterSystem.Api.DTOs.Citizens;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitizensController : ControllerBase
    {
        private readonly ICitizenService _service;
        public CitizensController(ICitizenService service) { _service = service; }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<CitizenLoginResponseDto>>> Register([FromBody] CitizenRegisterDto dto)
        {
            try { var result = await _service.RegisterAsync(dto); return Ok(ApiResponse<CitizenLoginResponseDto>.Ok(result)); }
            catch (Exception ex) { return BadRequest(ApiResponse<CitizenLoginResponseDto>.Fail(ex.Message)); }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<CitizenLoginResponseDto>>> Login([FromBody] CitizenLoginDto dto)
        {
            try { var result = await _service.LoginAsync(dto); return Ok(ApiResponse<CitizenLoginResponseDto>.Ok(result)); }
            catch (UnauthorizedAccessException ex) { return Unauthorized(ApiResponse<CitizenLoginResponseDto>.Fail(ex.Message)); }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<ApiResponse<CitizenDto>>> GetMe()
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetCitizenByIdAsync(citizenId);
            if (result == null) return NotFound(ApiResponse<CitizenDto>.Fail("Citizen not found"));
            return Ok(ApiResponse<CitizenDto>.Ok(result));
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<ActionResult<ApiResponse<CitizenDto>>> UpdateProfile([FromBody] CitizenDto dto)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.UpdateCitizenProfileAsync(citizenId, dto);
            return Ok(ApiResponse<CitizenDto>.Ok(result));
        }

        [Authorize]
        [HttpPut("me/password")]
        public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            try
            {
                var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _service.ChangePasswordAsync(citizenId, dto.CurrentPassword, dto.NewPassword);
                return Ok(ApiResponse<bool>.Ok(result, "Password changed successfully"));
            }
            catch (UnauthorizedAccessException ex) { return BadRequest(ApiResponse<bool>.Fail(ex.Message)); }
            catch (KeyNotFoundException ex) { return NotFound(ApiResponse<bool>.Fail(ex.Message)); }
        }
    }
}
