using SubCityLetterSystem.Api.DTOs.Auth;
using SubCityLetterSystem.Api.DTOs.Common;

namespace SubCityLetterSystem.Api.Services
{
    public interface IUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? role = null, int? departmentId = null);
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(UserDto dto, string password);
        Task<UserDto> UpdateUserAsync(int id, UserDto dto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> ToggleUserStatusAsync(int id);
    }
}