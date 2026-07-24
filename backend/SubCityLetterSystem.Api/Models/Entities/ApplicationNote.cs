using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class ApplicationNote
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public int? UserId { get; set; }
        public int? CitizenId { get; set; }
        [Required]
        public string Note { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Application Application { get; set; } = null!;
        public User? User { get; set; }
    }
}
