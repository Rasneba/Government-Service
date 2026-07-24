using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.DTOs.Appointments
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public int? ApplicationId { get; set; }
        public string? ApplicationNumber { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateAppointmentDto
    {
        [Required] public string ServiceName { get; set; } = string.Empty;
        public int? ApplicationId { get; set; }
        public int? DepartmentId { get; set; }
        [Required] public DateTime AppointmentDate { get; set; }
        [Required] public string TimeSlot { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class AvailableSlotDto
    {
        public string TimeSlot { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
