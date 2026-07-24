using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Appointments;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        public AppointmentService(AppDbContext context) { _context = context; }

        public async Task<List<AppointmentDto>> GetAppointmentsByCitizenAsync(int citizenId)
        {
            return await _context.Appointments
                .Where(a => a.CitizenId == citizenId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id, ServiceName = a.ServiceName, ApplicationId = a.ApplicationId,
                    ApplicationNumber = a.Application != null ? a.Application.ApplicationNumber : null,
                    DepartmentName = a.Department != null ? a.Department.Name : null,
                    AppointmentDate = a.AppointmentDate, TimeSlot = a.TimeSlot,
                    Status = a.Status, Notes = a.Notes, CreatedAt = a.CreatedAt
                }).ToListAsync();
        }

        public async Task<AppointmentDto?> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments
                .Where(a => a.Id == id)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id, ServiceName = a.ServiceName, ApplicationId = a.ApplicationId,
                    ApplicationNumber = a.Application != null ? a.Application.ApplicationNumber : null,
                    DepartmentName = a.Department != null ? a.Department.Name : null,
                    AppointmentDate = a.AppointmentDate, TimeSlot = a.TimeSlot,
                    Status = a.Status, Notes = a.Notes, CreatedAt = a.CreatedAt
                }).FirstOrDefaultAsync();
        }

        public async Task<AppointmentDto> CreateAppointmentAsync(CreateAppointmentDto dto, int citizenId)
        {
            var appointment = new Appointment
            {
                CitizenId = citizenId, ServiceName = dto.ServiceName, ApplicationId = dto.ApplicationId,
                DepartmentId = dto.DepartmentId, AppointmentDate = dto.AppointmentDate,
                TimeSlot = dto.TimeSlot, Notes = dto.Notes, Status = "Scheduled",
                CreatedAt = DateTime.UtcNow
            };
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return (await GetAppointmentByIdAsync(appointment.Id))!;
        }

        public async Task<AppointmentDto> CancelAppointmentAsync(int id, string reason)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) throw new KeyNotFoundException("Appointment not found");
            appointment.Status = "Cancelled";
            appointment.CancellationReason = reason;
            await _context.SaveChangesAsync();
            return (await GetAppointmentByIdAsync(id))!;
        }

        public async Task<List<AvailableSlotDto>> GetAvailableSlotsAsync(DateTime date, int? departmentId)
        {
            var bookedSlots = await _context.Appointments
                .Where(a => a.AppointmentDate.Date == date.Date && a.Status != "Cancelled")
                .Select(a => a.TimeSlot)
                .ToListAsync();

            var allSlots = new List<string>
            {
                "08:00-08:30", "08:30-09:00", "09:00-09:30", "09:30-10:00",
                "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00",
                "14:00-14:30", "14:30-15:00", "15:00-15:30", "15:30-16:00"
            };

            return allSlots.Select(s => new AvailableSlotDto
            {
                TimeSlot = s, IsAvailable = !bookedSlots.Contains(s)
            }).ToList();
        }
    }
}
