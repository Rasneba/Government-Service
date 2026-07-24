using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Feedback
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        public int? ApplicationId { get; set; }
        [Required, MaxLength(50)]
        public string Type { get; set; } = string.Empty;
        public int Rating { get; set; }
        [MaxLength(500)]
        public string? Subject { get; set; }
        [MaxLength(2000)]
        public string? Message { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Citizen Citizen { get; set; } = null!;
        public Application? Application { get; set; }
    }
}
