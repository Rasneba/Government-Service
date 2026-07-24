using System.ComponentModel.DataAnnotations;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [Required, MaxLength(500)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(2000)]
        public string? Message { get; set; }
        public NotificationType Type { get; set; } = NotificationType.Dashboard;
        public int? ReferenceId { get; set; }
        [MaxLength(50)]
        public string? ReferenceType { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }

        public User User { get; set; } = null!;
    }
}