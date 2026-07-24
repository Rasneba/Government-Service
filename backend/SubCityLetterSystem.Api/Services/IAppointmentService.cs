using SubCityLetterSystem.Api.DTOs.Appointments;

namespace SubCityLetterSystem.Api.Services
{
    public interface IAppointmentService
    {
        Task<List<AppointmentDto>> GetAppointmentsByCitizenAsync(int citizenId);
        Task<AppointmentDto?> GetAppointmentByIdAsync(int id);
        Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto dto, int citizenId);
        Task<AppointmentDto> CancelAppointmentAsync(int id, string reason);
        Task<List<AvailableSlotDto>> GetAvailableSlotsAsync(DateTime date, int? departmentId);
    }
}
