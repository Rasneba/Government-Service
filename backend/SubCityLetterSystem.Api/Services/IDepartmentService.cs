using SubCityLetterSystem.Api.DTOs.Common;

namespace SubCityLetterSystem.Api.Services
{
    public interface IDepartmentService
    {
        Task<List<DepartmentListDto>> GetAllAsync(int? organizationId = null);
        Task<DepartmentDetailDto?> GetByIdAsync(int id);
        Task<DepartmentDetailDto> CreateAsync(DepartmentDetailDto dto);
        Task<DepartmentDetailDto> UpdateAsync(int id, DepartmentDetailDto dto);
        Task<bool> DeleteAsync(int id);
    }

    public class DepartmentListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string OrganizationName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class DepartmentDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Code { get; set; }
        public int OrganizationId { get; set; }
        public string? OrganizationName { get; set; }
        public int? ParentDepartmentId { get; set; }
        public string? ParentDepartmentName { get; set; }
        public bool IsActive { get; set; }
    }
}