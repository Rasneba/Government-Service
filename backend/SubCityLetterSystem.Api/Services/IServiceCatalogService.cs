using SubCityLetterSystem.Api.DTOs.Services;

namespace SubCityLetterSystem.Api.Services
{
    public interface IServiceCatalogService
    {
        Task<List<ServiceCategoryDto>> GetCategoriesAsync();
        Task<List<ServiceTypeDto>> GetServiceTypesAsync(int? categoryId = null);
        Task<ServiceTypeDto?> GetServiceTypeByIdAsync(int id);
        Task<ServiceTypeDto> CreateServiceTypeAsync(ServiceTypeDto dto);
        Task<ServiceTypeDto> UpdateServiceTypeAsync(int id, ServiceTypeDto dto);
    }
}
