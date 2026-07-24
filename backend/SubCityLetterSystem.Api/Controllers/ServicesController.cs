using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Services;
using SubCityLetterSystem.Api.Services;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceCatalogService _service;
        public ServicesController(IServiceCatalogService service) { _service = service; }

        [HttpGet("categories")]
        public async Task<ActionResult<ApiResponse<List<ServiceCategoryDto>>>> GetCategories()
        {
            var result = await _service.GetCategoriesAsync();
            return Ok(ApiResponse<List<ServiceCategoryDto>>.Ok(result));
        }

        [HttpGet("types")]
        public async Task<ActionResult<ApiResponse<List<ServiceTypeDto>>>> GetServiceTypes([FromQuery] int? categoryId)
        {
            var result = await _service.GetServiceTypesAsync(categoryId);
            return Ok(ApiResponse<List<ServiceTypeDto>>.Ok(result));
        }

        [HttpGet("types/{id}")]
        public async Task<ActionResult<ApiResponse<ServiceTypeDto>>> GetServiceType(int id)
        {
            var result = await _service.GetServiceTypeByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<ServiceTypeDto>.Fail("Service type not found"));
            return Ok(ApiResponse<ServiceTypeDto>.Ok(result));
        }

        [HttpPost("types")]
        [Authorize(Roles = "SystemAdministrator,SubCityAdministrator")]
        public async Task<ActionResult<ApiResponse<ServiceTypeDto>>> CreateServiceType([FromBody] ServiceTypeDto dto)
        {
            var result = await _service.CreateServiceTypeAsync(dto);
            return Ok(ApiResponse<ServiceTypeDto>.Ok(result, "Service type created"));
        }

        [HttpPut("types/{id}")]
        [Authorize(Roles = "SystemAdministrator,SubCityAdministrator")]
        public async Task<ActionResult<ApiResponse<ServiceTypeDto>>> UpdateServiceType(int id, [FromBody] ServiceTypeDto dto)
        {
            var result = await _service.UpdateServiceTypeAsync(id, dto);
            return Ok(ApiResponse<ServiceTypeDto>.Ok(result, "Service type updated"));
        }
    }
}
