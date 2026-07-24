using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        public int? ApplicationId { get; set; }
        [Required, MaxLength(200)]
        public string ServiceName { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public DateTime AppointmentDate { get; set; }
        [MaxLength(20)]
        public string TimeSlot { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Status { get; set; } = "Scheduled";
        [MaxLength(500)]
        public string? Notes { get; set; }
        [MaxLength(500)]
        public string? CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public Citizen Citizen { get; set; } = null!;
        public Application? Application { get; set; }
        public Department? Department { get; set; }
    }
}
