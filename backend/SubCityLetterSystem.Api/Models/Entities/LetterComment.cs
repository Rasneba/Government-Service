using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class LetterComment
    {
        public int Id { get; set; }
        public int LetterId { get; set; }
        public int UserId { get; set; }
        [Required]
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Letter Letter { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}