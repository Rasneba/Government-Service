using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class LetterMovement
    {
        public int Id { get; set; }
        public int LetterId { get; set; }
        public int FromUserId { get; set; }
        public int? ToUserId { get; set; }
        public int? FromDepartmentId { get; set; }
        public int? ToDepartmentId { get; set; }
        [Required, MaxLength(50)]
        public string Action { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Letter Letter { get; set; } = null!;
        public User FromUser { get; set; } = null!;
        public User? ToUser { get; set; }
    }
}