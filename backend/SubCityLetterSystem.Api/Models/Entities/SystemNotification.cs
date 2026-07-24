using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class SystemNotification
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string? Message { get; set; }
        [MaxLength(50)]
        public string Type { get; set; } = "Info";
        public int? ApplicationId { get; set; }
        [MaxLength(50)]
        public string? ReferenceType { get; set; }
        public int? ReferenceId { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }

        public Citizen Citizen { get; set; } = null!;
    }
}
