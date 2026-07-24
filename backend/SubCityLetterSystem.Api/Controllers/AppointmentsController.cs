using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubCityLetterSystem.Api.DTOs.Appointments;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Services;
using System.Security.Claims;

namespace SubCityLetterSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _service;
        public AppointmentsController(IAppointmentService service) { _service = service; }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<AppointmentDto>>>> GetMyAppointments()
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.GetAppointmentsByCitizenAsync(citizenId);
            return Ok(ApiResponse<List<AppointmentDto>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> GetAppointment(int id)
        {
            var result = await _service.GetAppointmentByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<AppointmentDto>.Fail("Appointment not found"));
            return Ok(ApiResponse<AppointmentDto>.Ok(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> CreateAppointment([FromBody] CreateAppointmentDto dto)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CreateAppointmentAsync(dto, citizenId);
            return Ok(ApiResponse<AppointmentDto>.Ok(result, "Appointment booked"));
        }

        [HttpPut("{id}/cancel")]
        public async Task<ActionResult<ApiResponse<AppointmentDto>>> CancelAppointment(int id, [FromBody] CancelDto? dto)
        {
            var citizenId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _service.CancelAppointmentAsync(id, dto?.Reason ?? "Cancelled by citizen");
            return Ok(ApiResponse<AppointmentDto>.Ok(result, "Appointment cancelled"));
        }

        [HttpGet("slots")]
        public async Task<ActionResult<ApiResponse<List<AvailableSlotDto>>>> GetAvailableSlots(
            [FromQuery] DateTime date, [FromQuery] int? departmentId)
        {
            var result = await _service.GetAvailableSlotsAsync(date, departmentId);
            return Ok(ApiResponse<List<AvailableSlotDto>>.Ok(result));
        }
    }

    public class CancelDto { public string? Reason { get; set; } }
}
