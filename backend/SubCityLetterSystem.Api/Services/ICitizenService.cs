using SubCityLetterSystem.Api.DTOs.Citizens;

namespace SubCityLetterSystem.Api.Services
{
    public interface ICitizenService
    {
        Task<CitizenLoginResponseDto> RegisterAsync(CitizenRegisterDto dto);
        Task<CitizenLoginResponseDto> LoginAsync(CitizenLoginDto dto);
        Task<CitizenDto?> GetCitizenByIdAsync(int id);
        Task<CitizenDto> UpdateCitizenProfileAsync(int id, CitizenDto dto);
        Task<bool> ChangePasswordAsync(int id, string currentPassword, string newPassword);
    }
}
