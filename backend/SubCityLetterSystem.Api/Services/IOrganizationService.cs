using SubCityLetterSystem.Api.DTOs.Common;

namespace SubCityLetterSystem.Api.Services
{
    public interface IOrganizationService
    {
        Task<List<OrganizationDto>> GetAllAsync();
        Task<OrganizationDto?> GetByIdAsync(int id);
        Task<OrganizationDto> CreateAsync(OrganizationDto dto);
        Task<OrganizationDto> UpdateAsync(int id, OrganizationDto dto);
        Task<bool> DeleteAsync(int id);
    }

    public class OrganizationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Code { get; set; }
        public bool IsActive { get; set; }
    }
}