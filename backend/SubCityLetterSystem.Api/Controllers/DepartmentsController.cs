using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _service;

        public DepartmentsController(IDepartmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DepartmentListDto>>>> GetAll([FromQuery] int? organizationId = null)
        {
            var result = await _service.GetAllAsync(organizationId);
            return Ok(ApiResponse<List<DepartmentListDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<DepartmentDetailDto>>> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<DepartmentDetailDto>.Fail("Department not found"));
            return Ok(ApiResponse<DepartmentDetailDto>.Ok(result));
        }

        [HttpPost]
        [Authorize(Roles = "SystemAdministrator,SubCityAdministrator")]
        public async Task<ActionResult<ApiResponse<DepartmentDetailDto>>> Create([FromBody] DepartmentDetailDto dto)
        {
            try
            {
                var result = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<DepartmentDetailDto>.Ok(result, "Department created"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<DepartmentDetailDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SystemAdministrator,SubCityAdministrator")]
        public async Task<ActionResult<ApiResponse<DepartmentDetailDto>>> Update(int id, [FromBody] DepartmentDetailDto dto)
        {
            try
            {
                var result = await _service.UpdateAsync(id, dto);
                return Ok(ApiResponse<DepartmentDetailDto>.Ok(result, "Department updated"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<DepartmentDetailDto>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdministrator")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(ApiResponse<bool>.Fail("Department not found"));
            return Ok(ApiResponse<bool>.Ok(result, "Department deleted"));
        }
    }
}
