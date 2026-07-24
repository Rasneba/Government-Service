using SubCityLetterSystem.Api.DTOs.Auth;

namespace SubCityLetterSystem.Api.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto dto);
        Task<UserDto> GetCurrentUserAsync(int userId);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}