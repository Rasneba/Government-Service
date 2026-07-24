using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrganizationsController : ControllerBase
    {
        private readonly IOrganizationService _service;

        public OrganizationsController(IOrganizationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<OrganizationDto>>>> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(ApiResponse<List<OrganizationDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<OrganizationDto>>> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<OrganizationDto>.Fail("Organization not found"));
            return Ok(ApiResponse<OrganizationDto>.Ok(result));
        }

        [HttpPost]
        [Authorize(Roles = "SystemAdministrator")]
        public async Task<ActionResult<ApiResponse<OrganizationDto>>> Create([FromBody] OrganizationDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<OrganizationDto>.Ok(result, "Organization created"));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SystemAdministrator")]
        public async Task<ActionResult<ApiResponse<OrganizationDto>>> Update(int id, [FromBody] OrganizationDto dto)
        {
            try
            {
                var result = await _service.UpdateAsync(id, dto);
                return Ok(ApiResponse<OrganizationDto>.Ok(result, "Organization updated"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<OrganizationDto>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdministrator")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Organization not found"));
            return Ok(ApiResponse<bool>.Ok(result, "Organization deleted"));
        }
    }
}
