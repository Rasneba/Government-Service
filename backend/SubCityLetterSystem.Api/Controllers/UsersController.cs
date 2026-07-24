using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Auth;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SystemAdministrator,SubCityAdministrator")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<UserDto>>>> GetUsers(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 20,
            [FromQuery] string? role = null, [FromQuery] int? departmentId = null)
        {
            var result = await _userService.GetUsersAsync(page, pageSize, role, departmentId);
            return Ok(ApiResponse<PagedResult<UserDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(ApiResponse<UserDto>.Fail("User not found"));
            return Ok(ApiResponse<UserDto>.Ok(user));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                var user = await _userService.CreateUserAsync(request.User, request.Password);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, ApiResponse<UserDto>.Ok(user, "User created successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<UserDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(int id, [FromBody] UserDto dto)
        {
            try
            {
                var user = await _userService.UpdateUserAsync(id, dto);
                return Ok(ApiResponse<UserDto>.Ok(user, "User updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<UserDto>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("User not found"));
            return Ok(ApiResponse<bool>.Ok(result, "User deleted successfully"));
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<ActionResult<ApiResponse<bool>>> ToggleUserStatus(int id)
        {
            var result = await _userService.ToggleUserStatusAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("User not found"));
            return Ok(ApiResponse<bool>.Ok(result, "User status toggled"));
        }
    }

    public class CreateUserRequest
    {
        public UserDto User { get; set; } = new();
        public string Password { get; set; } = string.Empty;
    }
}
